//auth
module.exports.loginVal = [
  {
    field: "username",
    type: "string",
  },
  {
    field: "password",
    type: "string",
  },
];

module.exports.registerVal = [
  {
    field: "username",
    type: "string",
  },
  {
    field: "password",
    type: "string",
  },
  {
    field: "email",
    type: "string",
  },
  {
    field: "name",
    type: "string",
  },
  {
    field: "birthDay",
    type: "string",
  },
  {
    field: "gennder",
    type: "number",
  },
];

module.exports.activeUserVal = [
  {
    field: "username",
    type: "string",
  },
  {
    field: "code",
    type: "string",
  },
];

module.exports.forgotPassVal = [
  {
    field: "username",
    type: "string",
  },
];

module.exports.resetPassVal = [
  {
    field: "username",
    type: "string",
  },
  {
    field: "password",
    type: "string",
  },
  {
    field: "code",
    type: "string",
  },
];

module.exports.updateProfileVal = [
  {
    field: "name",
    type: "string",
  },
  {
    field: "gennder",
    type: "number",
  },
  {
    field: "birthDay",
    type: "string",
  },
  {
    field: "avatar",
    type: "string",
  },
  {
    field: "background",
    type: "string",
  },
];

module.exports.findUserbyUsernameVal = [
  {
    field: "usernameFind",
    type: "string",
  },
];

module.exports.findMultiUserbyUsernameVal = [
  {
    field: "listUser",
    type: "object",
  },
];

module.exports.addFriendVal = [
  {
    field: "usernameFriend",
    type: "string",
  },
];

module.exports.acceptFriendVal = [
  {
    field: "usernameAccept",
    type: "string",
  },
];

module.exports.deleteFriendVal = [
  {
    field: "usernameDelete",
    type: "string",
  },
];

//chat

module.exports.sendNewMessVal = [
  {
    field: "type",
    type: "number",
  },
  {
    field: "content",
    type: "string",
  },
  {
    field: "receiver",
    type: "object",
  },
];

module.exports.sendMessByRoomIDVal = [
  {
    field: "type",
    type: "number",
  },
  {
    field: "content",
    type: "string",
  },
  {
    field: "roomID",
    type: "string",
  },
];
