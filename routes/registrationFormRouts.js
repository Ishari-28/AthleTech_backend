const express = require("express");
const router = express.Router();
const multer = require("multer");
const registrationFormController = require("../controller/registrationFormController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/", registrationFormController.getAthletes);
router.get("/:id", registrationFormController.getAthleteByID);
router.post("/", upload.array("payment_slip"), registrationFormController.createAthlete);
router.put("/:id", upload.single("payment_slip"), registrationFormController.updateAthlete);
router.delete("/:id", registrationFormController.deleteAthlete);

module.exports = router;
