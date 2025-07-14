const express = require("express");
const {
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
} = require("../controller/adminController");

const {
  authenticateToken,
  requireSuperAdmin,
} = require("../middlewares/authMiddleware"); //  Import the middleware

const router = express.Router();

// Superadmin-only routes
router.post("/create", requireSuperAdmin, createAdmin);
router.put("/update", requireSuperAdmin, updateAdmin);
router.delete("/delete", requireSuperAdmin, deleteAdmin);
router.get("/all", authenticateToken, getAllAdmins);

module.exports = router;
