require('./../configs/dbconfig');
require('./../configs/cloudinaryconfig');
const express = require("express");
const router = express.Router();
const PatientModel = require('./../models/patient.model');
const DoctorModel = require('./../models/doctor.model');

/* LOG IN FIRST */
router.get('/', (req, res, next) => {
  res.send("Coucou c'est la page docteur");
});

/* HOMEPAGE: ADD NEW PATIENT OR GO TO THE DASHBOARD TO VIEW ALL PATIENTS */
router.get('homepage', (req, res, next) => {
  res.send("Coucou c'est la page d'accueil du docteur");
});

/* CREATE NEW PATIENT */
router.get('add-patient', (req, res, next) => {
  res.render(/* add the right view*/);
});

router.post('add-patient', (req, res, next) => {
  const { name, lastname, email, password } = req.body;
  PatientModel.create({ name, lastname, email, password })
  .then(dbRes => {
    console.log("Patient successfully added!");
    res.redirect('dashboard');
  })
  .catch(next);
})

/* DASHBOARD -> SEE ALL PATIENTS */
router.get('/dashboard', (req, res, next) => {
  DoctorModel.findById(doctor.id)
  .populate("mypatients")
  .then(dbRes => res.render("docPage", { doctorInfo: dbRes }))
  .catch(next);
});

module.exports = router;