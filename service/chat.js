const db = require("../config/mongodb").db("MegaTalk");

const createBoxChat = async (boxChat, member) => {
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

  for (var i = 0; i < member.length; i++) {
    //Find user member
    let find = await db.collection("User").findOne({
      username: member[i],
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
          username: member[i],
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
  }

  return result;
};

const validateMemberBoxChat = async (member) => {
  var result = true;
  //Validate member group
  for (var i = 0; i < member.length; i++) {
    let findMember = await db.collection("User").findOne({
      username: member[i],
    });
    if (!findMember) {
      return false;
    }
  }
  return result;
};

module.exports = { createBoxChat, validateMemberBoxChat };
