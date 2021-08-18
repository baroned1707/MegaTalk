const { verifyToken } = require("../config/jwt");

const auth = async (req, res, next) => {
  const token = req.headers["jwt"]?.replace("JWT ", "") || false;
  if (!token) return next(new Error(`${404}:Not found token !`));
  const decode = verifyToken(token);
  if (!decode) return next(new Error(`${403}:Forbidden !`));
  delete decode.exp;
  delete decode.iat;
  req.user = decode;
  next();
};

module.exports = {
  auth,
};
