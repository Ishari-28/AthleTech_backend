const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//  Corrected relative path
const {
  findByEmail,
  insertAdmin,
  updateOTP,
  verifyOTP,
  updatePassword,
  updateAdmin,
  deleteAdmin,
} = require("../models/adminUserModel"); 

const { sendOTPEmail } = require("../utils/mailer");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findByEmail(email);
  if (!user) return res.status(401).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign(
    { id: user.admin_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role, username: user.username });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await findByEmail(email);
  if (!user) return res.status(404).json({ message: "Email not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await updateOTP(email, otp, expiry);
  await sendOTPEmail(email, otp);

  res.json({ message: "OTP sent to your email" });
};

exports.verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const validOtp = await verifyOTP(email, otp);
  if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

  const hashed = await bcrypt.hash(newPassword, 10);
  await updatePassword(email, hashed);
  res.json({ message: "Password updated successfully" });
};

exports.createAdmin = async (req, res) => {
  const { username, email, password, contact_number, role, image_url } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await insertAdmin({ username, email, password: hashed, contact_number, role, image_url });
  res.status(201).json({ message: "Admin created" });
};

exports.updateAdminBySuper = async (req, res) => {
  const { oldEmail, newEmail, role } = req.body;
  await updateAdmin(oldEmail, newEmail, role);
  res.json({ message: "Admin updated" });
};

exports.deleteAdminBySuper = async (req, res) => {
  const { email } = req.body;
  await deleteAdmin(email);
  res.json({ message: "Admin deleted" });
};
