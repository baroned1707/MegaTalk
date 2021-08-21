const { sendNewMessVal } = require("../base/validate");
const { validate, createDefaultBoxChat } = require("../base/until");
const { createBoxChat, validateMemberBoxChat } = require("../service/chat");
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

    //create Box chat
    const boxChat = createDefaultBoxChat(
      req.user.username,
      valBody.receiver,
      valBody.type,
      valBody.content
    );
    const member = boxChat.member;

    //Validate member group
    const validateMember = await validateMemberBoxChat(member);
    if (!validateMember) {
      return next(
        new Error(`${404}:${`Not found username member, Pls check log !`}`)
      );
    }

    //Insert box chat on db
    const create = createBoxChat(boxChat, member);
    if (!create) {
      return next(new Error(`${404}:${`Create box fail, Pls check log !`}`));
    }

    //send notification
    //code here

    //send socket mess
    //code here

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

module.exports = {
  handleSendNewMess,
};
