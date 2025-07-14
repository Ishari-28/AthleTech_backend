const express = require("express");
const {
  login,
  forgotPassword,
  verifyOtpAndResetPassword,
  createAdmin,
  updateAdminBySuper,
  deleteAdminBySuper,
} = require("../controller/adminAuthController");

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyOtpAndResetPassword);

// Super Admin-only
router.post("/create", createAdmin);
router.put("/update", updateAdminBySuper);
router.delete("/delete", deleteAdminBySuper);

module.exports = router;
