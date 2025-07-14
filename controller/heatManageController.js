const { createHeatsByEvent } = require("../services/heatManageService");

const createHeatsByEventHandler = async (req, res) => {
  try {
    const { eventId, ageGroup, gender } = req.body;
    if (!eventId) {
      return res.status(400).send({
        success: false,
        message: "Invalid event ID",
      });
    }
    const eventDetails = await createHeatsByEvent(eventId, ageGroup, gender);

    res.status(200).send({
      success: true,
      message: "All heat details retrieved",
      data: eventDetails,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error retrieving heat details",
      error: error.message,
    });
  }
};

// get heats by eventId, ageGroup, gender call to the getHeatDetailsByeventId service

module.exports = {
   createHeatsByEvent: createHeatsByEventHandler,
};
