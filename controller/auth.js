const { validate, verifyPass } = require("../base/until");
const { loginVal } = require("../base/validate");
const { signToken } = require("../config/jwt");
const { valHasExistDB } = require("../service");

const handleLogin = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, loginVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", body.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Not found user !"}`));
    }

    //validate password
    const valPass = verifyPass(body.password, find.password);
    if (!valPass) {
      return next(new Error(`${400}:${"Password wrong !"}`));
    }

    //delete field private
    delete find.password;
    delete find.active;

    //generate token with payload is user data
    const accessToken = signToken(find);

    //send result
    return res.send({
      status: true,
      data: {
        accessToken: accessToken,
        userData: find,
      },
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

module.exports = {
  handleLogin,
};
