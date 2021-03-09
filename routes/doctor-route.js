require('./../configs/dbconfig');
require('./../configs/cloudinaryconfig');
const express = require("express");
const router = express.Router();
const PatientModel = require('./../models/patient.model');
const DoctorModel = require('./../models/doctor.model');

/* LOG IN FIRST */
router.get('/', (req, res, next) => {
  res.render("auth/doctor.signin");
});

/* DASHBOARD -> SEE ALL PATIENTS */
router.get('/dashboard', (req, res, next) => {
  DoctorModel.findById(req.session.currentUser._id)
  .populate("mypatients")
  .then(dbRes => res.render("dashboardDoctor", { doctorInfo: dbRes }))
  .catch(next);
});

/* CREATE NEW PATIENT */
router.get('add-patient', (req, res, next) => {
  res.render("createPatient");
});

router.post('add-patient', (req, res, next) => {
  const { name, lastname, email, password } = req.body;
  PatientModel.create({ name, lastname, email, password })
  .then(dbRes => {
    console.log("Patient successfully added!");
    res.redirect('/dashboard');
  })
  .catch(next);
});

module.exports = router;