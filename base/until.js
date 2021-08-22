const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { admin } = require("../config/firebaseadmin");

const createUniqueID = () => {
  var time = new Date();
  var UniqueID = "";
  for (var i = 0; i < 10; i++) {
    var code = Math.floor(Math.random() * (90 - 65) + 65);
    UniqueID += String.fromCharCode(code);
  }
  UniqueID += String(time.getTime());
  return UniqueID;
};

const fixTextSpaceAndLine = (string) => {
  var temp = String(string);
  temp = temp.replaceAll("\n", "");
  temp = temp.trim();
  return temp;
};

const writeLog = (code, message, req) => {
  let logPath = path.join(__dirname.replace("/base", "/log"), "/log.csv");
  let date = new Date().toString();
  let body = JSON.stringify(req.body);
  let headers = JSON.stringify(req.headers);
  let ip = req.ip;
  let hostname = req.hostname;
  let row = `${date},${code},${message},${hostname},${ip},${body}.${headers}\n`;
  fs.readFile(logPath, "utf8", (err, data) => {
    data += row;
    fs.writeFile(logPath, data, (err) => {
      if (err) {
        console.log("Error writing log to csv file", err);
      } else {
        console.log(`Write log done !`);
      }
    });
  });
};

const validate = (object, fields) => {
  var result = {};
  var val = Object.keys(object).map((cur) => {
    return {
      field: cur,
      type: typeof object[`${cur}`],
    };
  });

  if (val.length != fields.length) return false;

  for (var i = 0; i < fields.length; i++) {
    var check = val.some(
      (item) => item.field == fields[i].field && item.type == fields[i].type
    );
    if (!check) return false;
  }

  return object;
};

const hashPass = async (password) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const verifyPass = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

const generateCode = () => {
  var code = "";
  for (var i = 0; i < 5; i++) {
    code += Math.floor(Math.random() * (9 - 0) + 0);
  }
  return code;
};

const createDefaultUser = (cloneObject) => {
  return {
    ...cloneObject,
    active: false,
    createAt: new Date().toString(),
    block: false,
    friendsList: [],
    chatsList: [],
    requestsFriendList: [],
    notifications: [],
    avatar: "",
    background: "",
    code: generateCode(),
  };
};

const createDefaultMess = (
  sender,
  receiver,
  typeMess,
  content,
  index,
  roomID
) => {
  return {
    sender,
    seeder: [],
    type: typeMess,
    content: content,
    createAt: new Date().toString(),
    index: index,
    recall: false,
    roomID,
    receiver,
  };
};

const createDefaultBoxChat = (sender, receiver, typeMess, content) => {
  var member = receiver;
  var roomID = createUniqueID();
  var messagesList = [
    createDefaultMess(sender, receiver, typeMess, content, 0, roomID),
  ];
  member.push(sender);
  //set permisson with member on group
  member = member.map((cur) => {
    return {
      username: cur,
      permission: cur === sender ? 0 : 1, //0 admin , 1 member
    };
  });
  return {
    roomID: roomID,
    member,
    messagesList: messagesList,
    notifi: true,
    createAt: new Date().toString(),
    roomName: null,
    type: member.length == 2 ? 0 : 1, //0 private , 1 group
  };
};

const sendNotifi = async (title, body, data, token) => {
  const mess = {
    notification: {
      title: title,
      body: body,
    },
    data: {
      sender: data.sender,
      content: data.content,
      roomID: data.roomID,
      createAt: data.createAt,
    },
    token: token,
  };
  await admin
    .messaging()
    .send(mess)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

const returnType = (type, content) => {
  switch (type) {
    case 0:
      return content;
    case 1:
      return "Gửi một ảnh";
    case 2:
      return "Gửi một file";
    case 3:
      return "Gửi một bản ghi âm";
  }
};

const uploadFile = async (file, destination) => {
  var result = true;
  const filePath = file.destination + file.filename;
  await admin
    .storage()
    .bucket()
    .upload(filePath, {
      destination: destination + file.filename,
      public: true,
    })
    .then((res) => {
      result = res[0].metadata.mediaLink;
    })
    .catch((e) => {
      console.log(e);
      result = false;
    });
  fs.unlink(filePath, function (err) {});
  return result;
};

module.exports = {
  createUniqueID,
  fixTextSpaceAndLine,
  writeLog,
  validate,
  hashPass,
  verifyPass,
  createDefaultUser,
  generateCode,
  createDefaultBoxChat,
  createDefaultMess,
  sendNotifi,
  returnType,
  uploadFile,
};
