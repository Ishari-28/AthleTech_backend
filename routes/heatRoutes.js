const express = require("express");
const { createHeatsByEvent } = require("../controller/heatManageController");
const router = express.Router();

router.post("/", createHeatsByEvent);

module.exports = router;
