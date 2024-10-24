const db = require("../config/db");

//GET all athlete list
const getAthletes = async (req, res) => { 
    try {
        const data = await db.query('SELECT * FROM athletes')
        if (!data) {
            return res.status(404).send({
                success: false,
                message:'No records found'
            })
        }
        res.status(200).send({
            success: true,
            message: 'All students records',
            data: data[0],
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error',
            error
        })
    }
};

//GET Athlete by ID
const getAthleteByID = async (req, res) => {
    try {
        const athleteId = req.params.id
        if (!athleteId) {
            return res.status(404).send({
                success: false,
                message:'Invalid id'
            })
        }
        // const data = await db.query(`SELECT * FROM athletes WHERE id =`+athleteId)
        const data = await db.query(`SELECT * FROM athletes WHERE idathletes=?`, [athleteId,]);
        if (!data) {
            return res.status(404).send({
                success: false,
                message: 'No records found'
            });
        }

        res.status(200).send({
            success: true,
            athleteDetails: data[0],
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error',
            error
        })
    }
};
 
//CREATE Athlete
const createAthlete = async (req, res) => {
    try {
        const { name, contact_no, gender, event_id, emai, dob, age_group } = req.body
        if (!name || !contact_no || !gender || !event_id || !emai || !dob || !age_group) {
            return res.status(500).send({
                success: false,
                message:'Please provide all fields'
           })
        } 
        
        const data = await db.query(`INSERT INTO athletes (name, contact_no, gender, event_id, emai, dob, age_group) VALUES(? , ? , ? , ? , ? , ? , ? )`, [name, contact_no, gender, event_id, emai, dob, age_group])
        if (!data) {
            return res.status(404).send({
                success: false,
                message:'Error in insert query'
            })
        }

        res.status(201).send({
            success: true,
            message: 'New Athlete Record Created',
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in create new Athlete API',
            error
        })
    }
};

//UPDATTE Athlete
const updateAthlete = async (req, res) => { 
    try {
        const athleteID = req.params.id
        if (!athleteID) {
            return res.status(404).send({
                success: false,
                message:'Invalid Id'
            })
        }
        const { name, contact_no, gender, event_id, emai, dob, age_group } = req.body
        const data = await db.query(`UPDATE athletes SET name = ?, contact_no = ?, gender = ?, event_id = ?, emai = ?, dob = ?, age_group = ? WHERE idathletes = ?`, [name, contact_no, gender, event_id, emai, dob, age_group, athleteID])
        if (!data) {
            return res.status(500).send({
                success: false,
                message:'Error in update data'
            })
        }
        res.status(200).send({
            success: true,
            message: 'udpated success',
        });
    } catch (error) {
        console.log(error)
        res.stattus(500).send({
            success: false,
            message: 'Error Update Athlete  api',
            error
        })
    }
};

//DELETE Athlete
const deleteAthlete = async (req, res) => {
    try {
        const deleteAthlete = req.params.id
        if (!athleteID) {
            return res.status(404).send({
                success: false,
                message:'Please provide athlete Id'
           })
        }
        await db.query(`DELETE FROM athletes WHERE idathletes = ?`, [athleteID])
        res.status(200).send({
            success: false,
            message:'Athlete delete successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Delete API',
            error
        })
    }
}

module.exports = { getAthletes, getAthleteByID, createAthlete, updateAthlete, deleteAthlete };