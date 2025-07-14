const db = require("../config/db");

const getAllCoaches = async () => {
  const [data] = await db.query("SELECT * FROM coaches_details");
  return data;
};

const getCoachById = async (coachId) => {
  const [data] = await db.query("SELECT * FROM coaches_details WHERE coach_id = ?", [coachId]);
  return data[0];
};

const createCoach = async ({
  name,
  location,
  contact_no,
  social_media,
  description,
  expertise_areas,
  profile_image,
  extra_images,
}) => {
  return db.query(
    `INSERT INTO coaches_details 
      (name, location, contact_no, social_media, description, expertise_areas, profile_image, extra_images) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      location,
      contact_no,
      social_media,
      description,
      expertise_areas,
      profile_image,
      extra_images,
    ]
  );
};

const updateCoach = async (
  coachId,
  {
    name,
    location,
    contact_no,
    social_media,
    description,
    expertise_areas,
    profile_image,
    extra_images,
  }
) => {
  let query =
    "UPDATE coaches_details SET name=?, location=?, contact_no=?, social_media=?, description=?, expertise_areas=?";
  let params = [
    name,
    location,
    contact_no,
    social_media,
    description,
    expertise_areas,
  ];

  if (profile_image) {
    query += ", profile_image=?";
    params.push(profile_image);
  }
  if (extra_images) {
    query += ", extra_images=?";
    params.push(extra_images);
  }
  query += " WHERE coach_id=?";
  params.push(coachId);

  return db.query(query, params);
};

const deleteCoach = async (coachId) => {
  return db.query("DELETE FROM coaches_details WHERE coach_id = ?", [coachId]);
};

module.exports = {
  getAllCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach,
};