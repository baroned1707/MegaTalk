const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

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
  roomId
) => {
  return {
    sender,
    seeder: [],
    type: typeMess,
    content: content,
    createAt: new Date().toString(),
    index: index,
    recall: false,
    roomId,
    receiver,
  };
};

const createDefaultBoxChat = (sender, receiver, typeMess, content) => {
  var member = receiver;
  var roomId = createUniqueID();
  var messagesList = [
    createDefaultMess(sender, receiver, typeMess, content, 0, roomId),
  ];
  member.push(sender);
  return {
    roomId: roomId,
    member,
    messagesList: messagesList,
    notifi: true,
    createAt: new Date().toString(),
    roomName: null,
    type: member.length == 2 ? 0 : 1,
  };
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
};
