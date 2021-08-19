const {
  validate,
  verifyPass,
  createDefaultUser,
  hashPass,
  generateCode,
} = require("../base/until");
const {
  loginVal,
  registerVal,
  activeUserVal,
  forgotPassVal,
  resetPassVal,
} = require("../base/validate");
const { signToken } = require("../config/jwt");
const { sendCode } = require("../config/nodemail");
const {
  valHasExistDB,
  createUser,
  activeUser,
  createCode,
  updatePass,
} = require("../service");

const handleLogin = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, loginVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", valBody.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Not found user !"}`));
    }

    //validate password
    const valPass = await verifyPass(valBody.password, find.password);
    if (!valPass) {
      return next(new Error(`${400}:${"Password wrong !"}`));
    }

    //validate active account
    if (!find.active) {
      return next(new Error(`${400}:${"Account not active !"}`));
    }

    //delete field private
    delete find.password;
    delete find.active;
    delete find.createAt;
    delete find.block;
    delete find.code;
    delete find._id;

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

const handleRegister = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, registerVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", valBody.username, "User");
    if (find) {
      return next(new Error(`${404}:${"Username has not exist !"}`));
    }

    //hash password
    valBody.password = await hashPass(valBody.password);

    //create default user
    const defaultUser = createDefaultUser(valBody);

    //send code active account
    var code = await sendCode(defaultUser.email, defaultUser.code);

    if (!code) {
      return next(
        new Error(
          `${400}:${"Send code active to account fail, Pls check log !"}`
        )
      );
    }

    //create user on db
    var user = await createUser(defaultUser);
    if (!user) {
      return next(
        new Error(`${400}:${"Create new user fail, Pls check log !"}`)
      );
    }

    //delete field private
    delete defaultUser.password;
    delete defaultUser.active;
    delete defaultUser.createAt;
    delete defaultUser.block;
    delete defaultUser.code;
    delete defaultUser._id;

    return res.send({
      status: true,
      data: {
        userData: defaultUser,
      },
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

const handleActiveUser = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, activeUserVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", valBody.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Username has not exist !"}`));
    }

    //verifycode
    if (find.code != valBody.code) {
      return next(new Error(`${400}:${"Code active wrong !"}`));
    }

    //active user
    var active = await activeUser(find.username);
    if (!active) {
      return next(new Error(`${400}:${"Active fail, Pls check log!"}`));
    }

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

const handleForgotPass = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, forgotPassVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", valBody.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Username has not exist !"}`));
    }

    //send code forgotpass account
    var genCode = generateCode();
    var code = await sendCode(find.email, genCode);
    if (!code) {
      return next(
        new Error(
          `${400}:${"Send code active to account fail, Pls check log !"}`
        )
      );
    }

    //save code in db
    var saveCode = await createCode(valBody.username, genCode);
    if (!saveCode) {
      return next(
        new Error(
          `${400}:${"Save code active to account fail, Pls check log !"}`
        )
      );
    }

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

const handleResetPass = async (req, res, next) => {
  try {
    const body = req.body;
    const valBody = validate(body, resetPassVal);

    //validate body data
    if (!valBody) {
      return next(new Error(`${400}:${"Validate data fail !"}`));
    }

    //validate user data
    const find = await valHasExistDB("username", valBody.username, "User");
    if (!find) {
      return next(new Error(`${404}:${"Username has not exist !"}`));
    }

    //check code
    if (valBody.code != find.code) {
      return next(new Error(`${404}:${"Code wrong !"}`));
    }

    //create new pass
    var newPass = await hashPass(valBody.password);

    //save pass in db
    var pass = await updatePass(valBody.username, newPass);
    if (!pass) {
      return next(new Error(`${404}:${"Update pass fail, Pls check log !"}`));
    }

    return res.send({
      status: true,
    });
  } catch (e) {
    return next(new Error(`${400}:${e.message}`));
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  handleActiveUser,
  handleForgotPass,
  handleResetPass,
};
