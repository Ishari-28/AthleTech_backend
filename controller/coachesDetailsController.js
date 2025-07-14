const coachesDetailsService = require("../services/coachesDetailsService");

// GET all coaches
const getCoaches = async (req, res) => {
  try {
    const data = await coachesDetailsService.getAllCoaches();
    res.status(200).send({
      success: true,
      message: "All coaches retrieved",
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error retrieving coaches",
      error,
    });
  }
};

// GET coach by ID
const getCoachByID = async (req, res) => {
  try {
    const coachId = req.params.id;
    const data = await coachesDetailsService.getCoachById(coachId);
    if (!data) {
      return res.status(404).send({ success: false, message: "Coach not found" });
    }
    res.status(200).send({
      success: true,
      coach: data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error retrieving coach",
      error,
    });
  }
};

// CREATE coach
const createCoach = async (req, res) => {
  try {
    const {
      name,
      location,
      contact_no,
      social_media,
      description,
      expertise_areas,
    } = req.body;
    const profile_image = req.files?.profile_image
      ? req.files.profile_image[0].buffer
      : null;
    const extra_images = req.files?.extra_images
      ? Buffer.concat(req.files.extra_images.map((f) => f.buffer))
      : null;

    if (
      !name ||
      !location ||
      !contact_no ||
      !description ||
      !expertise_areas ||
      !profile_image
    ) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }

    await coachesDetailsService.createCoach({
      name,
      location,
      contact_no,
      social_media,
      description,
      expertise_areas,
      profile_image,
      extra_images,
    });
    res.status(201).send({ success: true, message: "Coach created" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error creating coach",
      error,
    });
  }
};

// UPDATE coach
const updateCoach = async (req, res) => {
  try {
    const coachId = req.params.id;
    const {
      name,
      location,
      contact_no,
      social_media,
      description,
      expertise_areas,
    } = req.body;
    const profile_image = req.files?.profile_image
      ? req.files.profile_image[0].buffer
      : null;
    const extra_images = req.files?.extra_images
      ? Buffer.concat(req.files.extra_images.map((f) => f.buffer))
      : null;

    await coachesDetailsService.updateCoach(coachId, {
      name,
      location,
      contact_no,
      social_media,
      description,
      expertise_areas,
      profile_image,
      extra_images,
    });
    res.status(200).send({ success: true, message: "Coach updated" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating coach",
      error,
    });
  }
};

// DELETE coach
const deleteCoach = async (req, res) => {
  try {
    const coachId = req.params.id;
    await coachesDetailsService.deleteCoach(coachId);
    res.status(200).send({ success: true, message: "Coach deleted" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting coach",
      error,
    });
  }
};

module.exports = {
  getCoaches,
  getCoachByID,
  createCoach,
  updateCoach,
  deleteCoach,
};