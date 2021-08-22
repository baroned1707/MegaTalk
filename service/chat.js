const { createDefaultMess, sendNotifi, returnType } = require("../base/until");
const { io } = require("../config/socket");
const { admin } = require("../config/firebaseadmin");
const db = require("../config/mongodb").db("MegaTalk");

const createBoxChat = async (boxChat, member, sender) => {
  var result = true;

  //insert boxchat on collection Boxchat
  var insertCollection = await db
    .collection("BoxChat")
    .insertOne(boxChat)
    .catch((e) => {
      console.log(e);
      result = false;
    });
  if (!insertCollection) {
    return result;
  }

  //insert box chat on list member
  for (var i = 0; i < member.length; i++) {
    //Find user member
    let find = await db.collection("User").findOne({
      username: member[i].username,
    });
    if (!find) {
      return false;
    }

    //Insert boxchat on collection boxchat
    find.chatsList.push(boxChat);
    await db
      .collection("User")
      .updateOne(
        {
          username: member[i].username,
        },
        {
          $set: {
            chatsList: find.chatsList,
          },
        }
      )
      .catch((e) => {
        console.log(e);
        result = false;
      });
    if (!result) {
      return result;
    }

    //send notifi and socket all member != sender
    if (member[i].username != sender) {
      //send notifi with fcm
      if (find.deviceToken != "") {
        var mess = boxChat.messagesList[0];
        var title = `${member[i].username} vừa gửi tin nhắn cho bạn`;
        var body = returnType(mess.type, mess.content);
        await sendNotifi(title, body, mess, find.deviceToken);
      }

      //send mess with socket
      var action = {
        type: "newBoxChat",
        data: JSON.stringify(boxChat),
      };
      io.emit(`${member[i].username}`, action);
    }
  }

  return result;
};

const validateMemberBoxChat = async (member) => {
  var result = true;
  //Validate member group
  for (var i = 0; i < member.length; i++) {
    let findMember = await db.collection("User").findOne({
      username: member[i].username,
    });
    if (!findMember) {
      return false;
    }
  }
  return result;
};

const insertMessByRoomID = async (boxChat, sender, type, content) => {
  var result = true;
  var receiver = boxChat.member.filter((item) => item != sender);
  var createMess = createDefaultMess(
    sender,
    receiver,
    type,
    content,
    boxChat.messagesList.length,
    boxChat.roomID
  );

  //insert mess to boxchat collection
  boxChat.messagesList.push(createMess);
  await db.collection("BoxChat").updateOne(
    {
      roomID: boxChat.roomID,
    },
    {
      $set: {
        messagesList: boxChat.messagesList,
      },
    }
  );

  //insert mess to boxchat user
  const member = boxChat.member;
  for (var i = 0; i < member.length; i++) {
    //find user member
    const findUser = await db.collection("User").findOne({
      username: member[i].username,
    });
    if (!findUser) {
      return false;
    }

    //find boxchat on user and insert mess
    const findBoxChat = findUser.chatsList.some(
      (item) => item.roomID === boxChat.roomID
    );
    if (findBoxChat) {
      //find box chat
      findUser.chatsList.map((cur) => {
        if (cur.roomID === boxChat.roomID) {
          cur.messagesList.push(createMess);
        }
      });
    } else {
      //not find box chat insert cloneboxchat on user
      var cloneBoxChat = { ...boxChat, messagesList: [] };
      findUser.chatsList.push(cloneBoxChat);
      findUser.chatsList.map((cur) => {
        if (cur.roomID === boxChat.roomID) {
          cur.messagesList.push(createMess);
        }
      });
    }

    await db
      .collection("User")
      .updateOne(
        {
          username: member[i].username,
        },
        {
          $set: {
            chatsList: findUser.chatsList,
          },
        }
      )
      .catch((e) => {
        console.log(e);
        result = false;
      });
    if (!result) {
      return result;
    }

    //send notifi and socket all member != sender
    if (member[i].username != sender) {
      //send notifi with fcm
      if (findUser.deviceToken != "") {
        var mess = createMess;
        var title = `${member[i].username} vừa gửi tin nhắn cho bạn`;
        var body = returnType(mess.type, mess.content);
        await sendNotifi(title, body, mess, findUser.deviceToken);
      }

      //send mess with socket
      var action = {
        type: "newMess",
        data: JSON.stringify(createMess),
      };
      io.emit(`${member[i].username}`, action);
    }
  }

  return result;
};

const findChatHasExist = async (member) => {
  var result = false;
  const find = await db
    .collection("BoxChat")
    .find({
      type: 0,
    })
    .toArray();
  await find.map((cur, i) => {
    var sender = cur.member.some((item) => item.username === member[0]);
    var receiver = cur.member.some((item) => item.username === member[1]);
    if (sender && receiver) {
      delete cur._id;
      result = cur;
    }
  });

  return result;
};

module.exports = {
  createBoxChat,
  validateMemberBoxChat,
  insertMessByRoomID,
  findChatHasExist,
};
