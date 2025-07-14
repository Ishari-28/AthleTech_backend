const mysqlpool = require("../config/db.js");

const getHeatDetailsByeventId = async (eventId, ageGroup, gender) => {
  try {
    // sql query to get heat details by eventId by joining register_athletes, heat table
   
    const [data] = await mysqlpool.query(
      `
      SELECT 
        h.heat_number,
        h.performance,
        h.qualified,
        a.athlete_id,
        a.name,
        a.bib_no,
        a.school,
        a.gender,
        a.age_group,
        e.event_name    
      FROM heats h
      JOIN register_athletes a ON h.athlete_id = a.athlete_id
      JOIN events e ON h.event_id = e.event_id
      WHERE h.event_id = ? AND a.age_group = ? AND a.gender = ?
      ORDER BY h.heat_number, a.bib_no
      `,
      [eventId, ageGroup, gender]
    );

    return {
      success: true,
      data,
      event_name: data.length ? data[0].event_name : null,  // include event name separately
      message: "Heat details retrieved successfully",
    };   
    
  } catch (error) {
    return {
      success: false,
      message: "Error retrieving heat details",
      error: error.message,
    };
  }
};

const createHeatsByEvent = async (eventId, ageGroup, gender) => {
  try {
    const [athletes] = await mysqlpool.query(
      `SELECT r.athlete_id, r.bib_no, r.name, r.school
        FROM register_athletes r
        JOIN register_athletes_event regEvents ON r.athlete_id = regEvents.athlete_id
        JOIN events e ON regEvents.event_id = e.event_id
        WHERE e.event_id = ? AND r.age_group = ? AND r.gender = ?`,
      [eventId, ageGroup, gender]
    );

    if (!athletes.length) {
      return { success: false, message: "No athletes found" };
    }

    // heat logic
    const totalAthletes = athletes.length;
    const maxPerHeat = 8;
    const totalHeats = Math.ceil(totalAthletes / maxPerHeat);
    const targetSize = Math.floor(totalAthletes / totalHeats);

    // Group athletes by school
    const schoolMap = new Map();
    for (const athlete of athletes) {
      if (!schoolMap.has(athlete.school)) {
        schoolMap.set(athlete.school, []);
      }
      schoolMap.get(athlete.school).push(athlete);
    }

    //Warn if any school has more athletes than totalHeats
    const overLimitSchools = Array.from(schoolMap.entries()).filter(([_, athletes]) => athletes.length > totalHeats);
    if (overLimitSchools.length > 0) {
      console.warn("School(s) with more athletes than number of heats:");
      overLimitSchools.forEach(([school, group]) => {
        console.warn(`- ${school}: ${group.length} athletes (Heats available: ${totalHeats})`);
      });
    }

    // Initialize heats and tracking sets
    const heats = Array.from({ length: totalHeats }, () => []);
    const heatSchoolMap = Array.from({ length: totalHeats }, () => new Set());

    // First round: place one athlete per school into different heats
    let roundRobinIndex = 0;
    const leftovers = [];

    for (const [school, group] of schoolMap.entries()) {
      while (group.length) {
        // Find a heat that doesn't yet have this school and isn't full
        let placed = false;

        for (let i = 0; i < totalHeats; i++) {
          const heatIndex = (roundRobinIndex + i) % totalHeats;
          if (
            !heatSchoolMap[heatIndex].has(school) &&
            heats[heatIndex].length < targetSize
          ) {
            heats[heatIndex].push(group.shift());
            heatSchoolMap[heatIndex].add(school);
            placed = true;
            break;
          }
        }

        if (!placed) {
          // Couldn’t find heat without conflict → add to leftovers
          leftovers.push(group.shift());
        }
        roundRobinIndex = (roundRobinIndex + 1) % totalHeats;
      }
    }

    //Second round: Add leftover athletes fairly (now allowing duplicates)
    leftovers.forEach((athlete) => {
      // Sort heats by current length, fill smallest
      heats.sort((a, b) => a.length - b.length);
      heats[0].push(athlete);
    });

    // save heat data to heat table
    const insertPromises = [];
    for (let i = 0; i < heats.length; i++) {
      for (const athlete of heats[i]) {
        insertPromises.push(
          mysqlpool.query(
            `INSERT INTO heats (event_id, athlete_id, bib_no, heat_number, age_group, gender, performance, qualified)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [eventId, athlete.athlete_id, athlete.bib_no, i + 1, ageGroup, gender, null, null]
          )
        );
      }
    }
    await Promise.all(insertPromises);

    return {
      success: true,
      message: "Heats created successfully with even distribution",
      heats,
      warning: overLimitSchools.length > 0
        ? "Some schools have more athletes than number of heats. Duplicates in heats may occur."
        : null,
    };

  } catch (error) {
    return {
      success: false,
      message: "Error fetching heat data",
      error: error.message,
    };
  }
};

module.exports = {
  getHeatDetailsByeventId,
  createHeatsByEvent,
};
