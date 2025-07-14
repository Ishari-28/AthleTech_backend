// Updated registrationFormController.js
const db = require("../config/db");

// GET all athlete list
const getAthletes = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM register_athletes");
    res.status(200).send({
      success: true,
      message: "All registered athletes",
      data,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Server error", error });
  }
};

// GET athlete by ID
const getAthleteByID = async (req, res) => {
  try {
    const [data] = await db.query(
      "SELECT * FROM register_athletes WHERE athlete_id = ?",
      [req.params.id]
    );
    if (!data.length) {
      return res
        .status(404)
        .send({ success: false, message: "Athlete not found" });
    }

    const athlete = data[0];
    athlete.payment_slip = athlete.payment_slip.toString("base64"); // convert binary to base64

    res.status(200).send({ success: true, data: athlete });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error", error });
  }
};

// Generate next bib_no
const getNextBibNo = async () => {
  const [rows] = await db.query(
    "SELECT MAX(bib_no) AS maxBib FROM register_athletes"
  );
  return rows[0].maxBib ? rows[0].maxBib + 1 : 100;
};

// POST - Create single or multiple athletes
const createAthlete = async (req, res) => {
  try {
    const athletes = req.body.athletes || [req.body];
    const year = new Date().getFullYear();

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Payment slip image(s) required" });
    }

    for (let i = 0; i < athletes.length; i++) {
      const {
        name,
        email,
        contact_no,
        gender,
        address,
        school,
        dob,
        age_group,
        select_events,
        tot_registrationfee,
      } = athletes[i];
      const paymentSlip = req.files[i]?.buffer;
      const bib_no = await getNextBibNo();

      if (
        !name ||
        !email ||
        !contact_no ||
        !gender ||
        !school ||
        !dob ||
        !age_group ||
        !select_events ||
        !tot_registrationfee ||
        !paymentSlip
      ) {
        return res.status(400).send({
          success: false,
          message: "All fields including image required",
        });
      }

      const [result] = await db.query(
        "INSERT INTO register_athletes (bib_no, name, email, contact_no, gender, school, dob, age_group, select_events, tot_registrationfee, payment_slip, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          bib_no,
          name,
          email,
          contact_no,
          gender,
          address,
          dob,
          age_group,
          select_events,
          tot_registrationfee,
          paymentSlip,
          year,
        ]
      );

      const athleteId = result.insertId;
      const selectEvents =
        typeof select_events === "string"
          ? JSON.parse(select_events)
          : select_events;

      for (const element of selectEvents) {
        await db.query(
          "INSERT INTO register_athletes_event (athlete_id, event_id) VALUES (?, ?)",
          [athleteId, element.eventId]
        );
      }
    }

    res
      .status(201)
      .json({ success: true, message: "Athlete(s) created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Create error", error: error.message });
  }
};

// UPDATE
const updateAthlete = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      email,
      contact_no,
      gender,
      school,
      dob,
      age_group,
      select_events,
      tot_registrationfee,
    } = req.body;
    const payment_slip = req.file?.buffer;

    if (
      !name ||
      !email ||
      !contact_no ||
      !gender ||
      !school ||
      !dob ||
      !age_group ||
      !select_events ||
      !tot_registrationfee
    ) {
      return res
        .status(400)
        .send({ success: false, message: "All fields required" });
    }

    const query = payment_slip
      ? "UPDATE register_athletes SET name=?, email=?, contact_no=?, gender=?, school=?, dob=?, age_group=?, select_events=?, tot_registrationfee=?, payment_slip=? WHERE athlete_id=?"
      : "UPDATE register_athletes SET name=?, email=?, contact_no=?, gender=?, school=?, dob=?, age_group=?, select_events=?, tot_registrationfee=? WHERE athlete_id=?";

    const params = payment_slip
      ? [
          name,
          email,
          contact_no,
          gender,
          school,
          dob,
          age_group,
          select_events,
          tot_registrationfee,
          payment_slip,
          id,
        ]
      : [
          name,
          email,
          contact_no,
          gender,
          school,
          dob,
          age_group,
          select_events,
          tot_registrationfee,
          id,
        ];

    await db.query(query, params);

    res.status(200).send({ success: true, message: "Updated successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: "Update error", error });
  }
};

// DELETE
const deleteAthlete = async (req, res) => {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM register_athletes WHERE athlete_id = ?", [id]);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete error", error });
  }
};

module.exports = {
  getAthletes,
  getAthleteByID,
  createAthlete,
  updateAthlete,
  deleteAthlete,
};
