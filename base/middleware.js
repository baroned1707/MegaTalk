const { verifyToken } = require("../config/jwt");
const multer = require("multer");

const auth = async (req, res, next) => {
  const token = req.headers["jwt"]?.replace("JWT ", "") || false;
  if (!token) return next(new Error(`${404}:Not found token !`));
  const decode = verifyToken(token);
  if (!decode) return next(new Error(`${403}:Forbidden !`));
  delete decode.exp;
  delete decode.iat;
  req.user = decode;
  return next();
};

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalname = file.originalname;
    const mineType = originalname.slice(
      originalname.indexOf("."),
      originalname.length
    );
    const filename = file.fieldname + "-" + uniqueSuffix + mineType;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

module.exports = {
  auth,
  upload,
};
