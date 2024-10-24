const express = require('express');
const {
    getAthletes,
    getAthleteByID,
    createAthlete,
    updateAthlete,
    deleteAthlete
    } = require("../controller/athletesController");

//routes object
const router = express.Router();

//routes

//GET all athletes list || GET
router.get("/getall", getAthletes);

//GET Athlete by ID
router.get('/get/:id', getAthleteByID);

//CREATE Athlete || POST
router.post('/create', createAthlete);

//UPDATE Athllete || PUT
router.put('/update/:id', updateAthlete);

//DELETE Athletes || DELETE
router.delete('/delete/:id', deleteAthlete)

module.exports = router;