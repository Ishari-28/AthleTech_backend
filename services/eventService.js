const db = require("../config/db");

const getAllEvents = async () => {
  const [events] = await db.query("SELECT * FROM events");
  return events;
};

const getEventById = async (id) => {
  const [events] = await db.query("SELECT * FROM events WHERE event_id = ?", [id]);
  return events[0];
};

const createEvent = async (event_name) => {
  return db.query("INSERT INTO events (event_name) VALUES (?)", [event_name]);
};

const updateEvent = async (id, event_name) => {
  return db.query("UPDATE events SET event_name = ? WHERE event_id = ?", [event_name, id]);
};

const deleteEvent = async (id) => {
  return db.query("DELETE FROM events WHERE event_id = ?", [id]);
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};