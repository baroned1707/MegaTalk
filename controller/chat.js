const {
  sendNewMessVal,
  sendMessByRoomIDVal,
  seederVal,
  recallVal,
  addMemberGroupVal,
  deleteMemberGroupVal,
  deleteMessVal,
  deleteBoxChatVal,
} = require("../base/validate");
const { validate, createDefaultBoxChat, uploadFile } = require("../base/until");
const {
  createBoxChat,
  validateMemberBoxChat,
  insertMessByRoomID,
  findChatHasExist,
  seederSave,
  recallSave,
  addMemberBoxChat,
  deleteMemberBoxChat,
  updateChatList,
} = require("../service/chat");
const { valHasExistDB } = require("../service/auth");

const handleSendNewMess = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, sendNewMessVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", req.user.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Not found user !"}`));
    }

    //validate receiver
    if (valBody.receiver.length == 0) {
      return next(new Error(`${404}:${"Receiver is empty !"}`));
    }

    //validate you not send mess yourself
    const sendYourSelf = valBody.receiver.includes(req.user.username);
    if (sendYourSelf) {
      return next(new Error(`${404}:${"You not send mess yourself !"}`));
    }

    //find box chat has exist if receiver = 1
    var boxChat = null;
    if (valBody.receiver.length == 1) {
      const findBoxChat = await findChatHasExist([
        req.user.username,
        valBody.receiver[0],
      ]);
      if (findBoxChat) {
        console.log("Find and Insert");
        req.body = {
          type: valBody.type,
          content: valBody.content,
          roomID: findBoxChat.roomID,
        };
        return handleSendMessByRoomID(req, res, next);
      }
    }

    //create Box chat if not find
    if (!boxChat) {
      boxChat = createDefaultBoxChat(
        req.user.username,
        valBody.receiver,
        valBody.type,
        valBody.content
      );
    }

    //Validate member group
    const member = boxChat.member;
    const validateMember = await validateMemberBoxChat(member);
    if (!validateMember) {
      return next(
        new Error(`${404}:${`Not found username member, Pls check log !`}`)
      );
    }

    //Insert box chat on db
    console.log("Create");
    const create = createBoxChat(boxChat, member, req.user.username);
    if (!create) {
      return next(new Error(`${400}:${`Create box fail, Pls check log !`}`));
    }

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

const handleSendMessByRoomID = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, sendMessByRoomIDVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", req.user.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Not found user !"}`));
    }

    //validate boxchat
    const boxChat = await valHasExistDB("roomID", valBody.roomID, "BoxChat");
    if (!boxChat) {
      return next(new Error(`${404}:${"Not found box chat !"}`));
    }

    //validate username in group ?
    const join = boxChat.member.some(
      (item) => item.username === req.user.username
    );
    if (!join) {
      return next(
        new Error(`${400}:${"You not permission send mess on group !"}`)
      );
    }

    //insert mess on db
    const insertMess = await insertMessByRoomID(
      boxChat,
      req.user.username,
      valBody.type,
      valBody.content
    );
    if (!insertMess) {
      return next(
        new Error(`${400}:${"Insert mess on db fail, Pls check log!"}`)
      );
    }

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

const handleSeeder = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, seederVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", req.user.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Not found user !"}`));
    }

    //save seeder to db
    const seeder = seederSave(valBody.roomID, valBody.index, req.user.username);
    if (!seeder) {
      return next(
        new Error(`${400}:${"Save seeder to mess fail, Pls check log !"}`)
      );
    }

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

const handleRecall = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, recallVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", req.user.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Not found user !"}`));
    }

    const recall = recallSave(valBody.roomID, valBody.index, req.user.username);
    if (!recall) {
      return next(
        new Error(`${400}:${"Recall to mess fail, Pls check log !"}`)
      );
    }

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

const handleUploadFile = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return next(new Error(`${404}:${"Please upload file !"}`));
    }

    //upload file on firebase storange
    const upload = await uploadFile(req.file, `file/${req.user.username}/`);
    if (!upload) {
      return next(new Error(`${400}:${"Upload file fail!"}`));
    }

    return res.send({
      status: true,
      data: upload,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

const handleAddMemberGroup = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, addMemberGroupVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", req.user.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Not found user !"}`));
    }

    //validate boxchat by roomid
    const boxChat = await valHasExistDB("roomID", valBody.roomID, "BoxChat");
    if (!boxChat) {
      return next(new Error(`${404}:${"Not found box chat !"}`));
    }

    //validate member add group
    const memberAdd = await valHasExistDB("username", valBody.username, "User");
    if (!memberAdd) {
      return next(new Error(`${404}:${"Not found user add !"}`));
    }

    //validate permisson user request
    const permisson = boxChat.member.some(
      (item) => item.username === req.user.username && item.permission == 1
    );
    if (!permisson) {
      return next(new Error(`${404}:${"Permisson denied !"}`));
    }

    //validate username add has exist
    const usernameHasExist = boxChat.member.some(
      (item) => item.username === valBody.username
    );
    if (usernameHasExist) {
      return next(new Error(`${404}:${"Username add has exist to group !"}`));
    }

    //add new member to boxchat var
    boxChat.member.push({
      username: valBody.username,
      permisson: 0,
    });

    //save new member to db
    const add = await addMemberBoxChat(
      valBody.roomID,
      boxChat.member,
      valBody.username
    );
    if (!add) {
      return next(
        new Error(`${400}:${"Save new member to db fail, Pls check log !"}`)
      );
    }

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

const handleDeleteMemeberGroup = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, deleteMemberGroupVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", req.user.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Not found user !"}`));
    }

    //validate boxchat by roomid
    const boxChat = await valHasExistDB("roomID", valBody.roomID, "BoxChat");
    if (!boxChat) {
      return next(new Error(`${404}:${"Not found box chat !"}`));
    }

    //validate member add group
    const memberAdd = await valHasExistDB("username", valBody.username, "User");
    if (!memberAdd) {
      return next(new Error(`${404}:${"Not found user add !"}`));
    }

    //validate permisson user request
    const permisson = boxChat.member.some(
      (item) => item.username === req.user.username && item.permission == 1
    );
    if (!permisson) {
      return next(new Error(`${404}:${"Permisson denied !"}`));
    }

    //validate username add has exist
    const usernameHasExist = boxChat.member.some(
      (item) => item.username === valBody.username
    );
    if (!usernameHasExist) {
      return next(
        new Error(`${404}:${"Username add has not exist to group !"}`)
      );
    }

    //del member to boxchat var
    boxChat.member = boxChat.member.filter(
      (item) => item.username != valBody.username
    );

    const del = await deleteMemberBoxChat(
      valBody.roomID,
      boxChat.member,
      valBody.username
    );
    if (!del) {
      return next(
        new Error(`${400}:${"Save new member to db fail, Pls check log !"}`)
      );
    }

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

const handleDeleteMess = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, deleteMessVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", req.user.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Not found user !"}`));
    }

    //validate boxchat by roomid
    const boxChat = await valHasExistDB("roomID", valBody.roomID, "BoxChat");
    if (!boxChat) {
      return next(new Error(`${404}:${"Not found box chat !"}`));
    }

    //validate username join box chat
    //validate username in group ?
    const join = boxChat.member.some(
      (item) => item.username === req.user.username
    );
    if (!join) {
      return next(
        new Error(`${400}:${"You not permission send mess on group !"}`)
      );
    }

    var valSender = true;
    //delete mess var
    find.chatsList.map((cur, i) => {
      if (cur.roomID == valBody.roomID) {
        valSender = some(
          (item) =>
            item.index != valBody.index && item.sender === req.user.username
        );
        if (valSender) {
          cur.messagesList = cur.messagesList.filter(
            (item) =>
              item.index != valBody.index && item.sender === req.user.username
          );
        }
      }
    });

    //validate Sender
    if (!valSender) {
      return next(new Error(`${400}:${"You not sender mess !"}`));
    }

    const delMess = updateChatList(req.user.username, find.chatsList);
    if (!delMess) {
      return next(new Error(`${400}:${"Save db fail, Pls check log !"}`));
    }

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

const handleDeleteBoxChat = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, deleteBoxChatVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", req.user.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Not found user !"}`));
    }

    //validate boxchat by roomid
    const boxChat = await valHasExistDB("roomID", valBody.roomID, "BoxChat");
    if (!boxChat) {
      return next(new Error(`${404}:${"Not found box chat !"}`));
    }

    //validate username join box chat
    //validate username in group ?
    const join = boxChat.member.some(
      (item) => item.username === req.user.username
    );
    if (!join) {
      return next(
        new Error(`${400}:${"You not permission send mess on group !"}`)
      );
    }

    //delete boxchat var
    find.chatsList = find.chatsList.filter(
      (item) => item.roomID != valBody.roomID
    );

    const delMess = updateChatList(req.user.username, find.chatsList);
    if (!delMess) {
      return next(new Error(`${400}:${"Save db fail, Pls check log !"}`));
    }

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

module.exports = {
  handleSendNewMess,
  handleSendMessByRoomID,
  handleSeeder,
  handleRecall,
  handleUploadFile,
  handleAddMemberGroup,
  handleDeleteMemeberGroup,
  handleDeleteMess,
  handleDeleteBoxChat,
};
