const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Athletech Admin OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
