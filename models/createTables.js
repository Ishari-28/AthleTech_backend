const mysqlpool = require("../config/db");

//Register-Athletes-Event table
const createRegisterAthletesEventTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS register_athletes_event (
        athlete_id INT NOT NULL,
        event_id INT NOT NULL,
        PRIMARY KEY (athlete_id, event_id),
        FOREIGN KEY (athlete_id) REFERENCES register_athletes(athlete_id),
        FOREIGN KEY (event_id) REFERENCES event(event_id)
    );
  `;
  const conn = await mysqlpool.getConnection();
  await conn.query(query);
  conn.release();
};

//Events table
const createTournamentEvents = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS events (
     event_id INT AUTO_INCREMENT PRIMARY KEY,
     event_name VARCHAR(255) NOT NULL
    );
    `;
  const conn = await mysqlpool.getConnection();
  await conn.query(query);
  conn.release();
};

// 3. Heats table (// add table for heats with (athlete_id foreign key to register_athletes, heat, performance, eventId foreign key to the event table)

const createHeatsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS heats (
    heat_create_table_id INT AUTO_INCREMENT PRIMARY KEY,
    athlete_id INT NOT NULL,
    event_id INT NOT NULL,
    bib_no INT,
    heat_number INT NOT NULL,
    age_group VARCHAR(50),
    gender VARCHAR(10),
    performance VARCHAR(255),
    qualified VARCHAR(10),
    FOREIGN KEY (athlete_id) REFERENCES register_athletes(athlete_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
    );
  `;
  const conn = await mysqlpool.getConnection();
  await conn.query(query);
  conn.release();
};



const createAllTables = async () => {
  try {
    await createRegisterAthletesEventTable();
    await createTournamentEvents();
    await createHeatsTable();
  } catch (error) {
    console.error("Error creating tables:", error.message);
  }
};

module.exports = {
  createAllTables,
};
