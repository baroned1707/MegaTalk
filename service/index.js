const db = require("../config/mongodb").db("MegaTalk");

const valHasExistDB = async (field, value, collection) => {
  var temp = {};
  temp[`${field}`] = value;
  const result = await db.collection(collection).findOne(temp);
  return result;
};

const createUser = async (user) => {
  var result = true;
  await db
    .collection("User")
    .insertOne(user)
    .catch((e) => {
      result = false;
    });
  return result;
};

const createCode = async (username, code) => {
  var result = true;
  await db
    .collection("User")
    .updateOne(
      {
        username: username,
      },
      {
        $set: {
          code: code,
        },
      }
    )
    .catch((e) => {
      result = false;
    });
  return result;
};

const activeUser = async (username) => {
  var result = true;
  await db
    .collection("User")
    .updateOne(
      {
        username: username,
      },
      {
        $set: {
          active: true,
        },
      }
    )
    .catch((e) => {
      result = false;
    });
  return result;
};

const updatePass = async (username, password) => {
  var result = true;
  await db
    .collection("User")
    .updateOne(
      {
        username: username,
      },
      {
        $set: {
          password: password,
        },
      }
    )
    .catch((e) => {
      result = false;
    });
  return result;
};

const updateProfile = async (username, update) => {
  var result = true;
  await db
    .collection("User")
    .updateOne(
      {
        username: username,
      },
      {
        $set: update,
      }
    )
    .catch((e) => {
      result = false;
    });
  return result;
};

const updateFriendRequest = async (usernameFriend, requestsFriendList) => {
  var result = true;
  await db
    .collection("User")
    .updateOne(
      {
        username: usernameFriend,
      },
      {
        $set: {
          requestsFriendList: requestsFriendList,
        },
      }
    )
    .catch((e) => {
      result = false;
    });
  return result;
};

module.exports = {
  valHasExistDB,
  createUser,
  activeUser,
  createCode,
  updatePass,
  updateProfile,
  updateFriendRequest,
};
