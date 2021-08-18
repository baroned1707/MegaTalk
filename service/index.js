const { db } = require("../config/mongodb");

const valHasExistDB = async (field, value, collection) => {
  var temp = {};
  temp[`${field}`] = value;
  const result = db.collection(collection).findOne(temp);
  return result;
};

module.exports = {
  valHasExistDB,
};
