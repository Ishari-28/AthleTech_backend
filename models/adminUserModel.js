const db = require("../config/db");

exports.findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM admin_users WHERE email = ?", [email]);
  return rows[0];
};

exports.insertAdmin = async ({ username, email, password, contact_number, role, image_url }) => {
  await db.query(
    "INSERT INTO admin_users (username, email, password, contact_number, role, image_url) VALUES (?, ?, ?, ?, ?, ?)",
    [username, email, password, contact_number, role, image_url]
  );
};

exports.updateOTP = async (email, otp, expires) => {
  await db.query("UPDATE admin_users SET otp_code = ?, otp_expires = ? WHERE email = ?", [
    otp,
    expires,
    email,
  ]);
};

exports.verifyOTP = async (email, otp) => {
  const [rows] = await db.query(
    "SELECT * FROM admin_users WHERE email = ? AND otp_code = ? AND otp_expires > NOW()",
    [email, otp]
  );
  return rows[0];
};

exports.updatePassword = async (email, hashedPassword) => {
  await db.query("UPDATE admin_users SET password = ?, otp_code = NULL, otp_expires = NULL WHERE email = ?", [
    hashedPassword,
    email,
  ]);
};

exports.updateAdmin = async (oldEmail, newEmail, role) => {
  await db.query("UPDATE admin_users SET email = ?, role = ? WHERE email = ?", [newEmail, role, oldEmail]);
};

exports.deleteAdmin = async (email) => {
  await db.query("DELETE FROM admin_users WHERE email = ?", [email]);
};
