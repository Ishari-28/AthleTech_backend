const express = require("express");
const router = express.Router();
const multer = require("multer");
const coachesDetailsController = require("../controller/coachesDetailsController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", coachesDetailsController.getCoaches);
router.get("/:id", coachesDetailsController.getCoachByID);
router.post(
  "/",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "extra_images", maxCount: 6 },
  ]),
  coachesDetailsController.createCoach
);
router.put(
  "/:id",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "extra_images", maxCount: 6 },
  ]),
  coachesDetailsController.updateCoach
);
router.delete("/:id", coachesDetailsController.deleteCoach);

module.exports = router;
