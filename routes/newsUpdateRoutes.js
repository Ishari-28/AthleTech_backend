const express = require("express");
const router = express.Router();
const multer = require("multer");
const newsUpdateController = require("../controller/newsUpdateController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/", newsUpdateController.getNewsUpdates);
router.get("/:id", newsUpdateController.getNewsUpdateByID);
router.post("/", upload.single("image"), newsUpdateController.createNewsUpdate);
router.put("/:id", upload.single("image"), newsUpdateController.updateNewsUpdate);
router.delete("/:id", newsUpdateController.deleteNewsUpdate);

module.exports = router;