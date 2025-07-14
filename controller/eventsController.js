const eventsService = require("../services/eventsService");

const getAllEvents = async (req, res) => {
  try {
    const events = await eventsService.getAllEvents();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching events", error });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await eventsService.getEventById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching event", error });
  }
};

const createEvent = async (req, res) => {
  try {
    const { event_name } = req.body;
    if (!event_name) {
      return res.status(400).json({ success: false, message: "Event name is required" });
    }
    await eventsService.createEvent(event_name);
    res.status(201).json({ success: true, message: "Event created" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating event", error });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { event_name } = req.body;
    await eventsService.updateEvent(id, event_name);
    res.status(200).json({ success: true, message: "Event updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating event", error });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await eventsService.deleteEvent(id);
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting event", error });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};