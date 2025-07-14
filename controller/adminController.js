const bcrypt = require("bcryptjs");
const {
  findByEmail,
  getAllAdmins,
  insertAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../models/adminUserModel");

// CREATE admin (POST)
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password, contact_number, role, image_url } = req.body;

    const existing = await findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await insertAdmin({
      username,
      email,
      password: hashedPassword,
      contact_number,
      role,
      image_url,
    });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("Create Admin Error:", err);
    res.status(500).json({ message: "Server error while creating admin" });
  }
};

//  READ all admins (GET)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await getAllAdmins();
    res.json(admins);
  } catch (err) {
    console.error("Get Admins Error:", err);
    res.status(500).json({ message: "Server error while retrieving admins" });
  }
};

//  UPDATE admin role or email (PUT)
exports.updateAdmin = async (req, res) => {
  try {
    const { oldEmail, newEmail, role } = req.body;

    await updateAdmin(oldEmail, newEmail, role);
    res.json({ message: "Admin updated successfully" });
  } catch (err) {
    console.error("Update Admin Error:", err);
    res.status(500).json({ message: "Server error while updating admin" });
  }
};

//  DELETE admin by email (DELETE)
exports.deleteAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    await deleteAdmin(email);
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Delete Admin Error:", err);
    res.status(500).json({ message: "Server error while deleting admin" });
  }
};
