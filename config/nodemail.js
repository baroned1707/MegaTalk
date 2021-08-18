var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nguyenduykhuongtqtpy@gmail.com",
    pass: "iizdcwwlvdcoztun",
  },
});

const sendCode = async (to, code) => {
  var result = true;
  var mailOptions = {
    from: "nguyenduykhuongtqtpy@gmail.com",
    to: to,
    subject: "Verify code to active account MegaTalk !",
    text: `Your code : ${code}`,
  };

  await transporter.sendMail(mailOptions).catch((e) => {
    console.log(e.message);
    result = false;
  });
  return result;
};

module.exports = {
  sendCode,
};
