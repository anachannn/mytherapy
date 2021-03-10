require('./../configs/dbconfig');
require('./../configs/cloudinaryconfig');
const express = require("express");
const router = express.Router();
const PatientModel = require('./../models/patient.model');
const DoctorModel = require('./../models/doctor.model');
const TextModel = require('./../models/text.model');
const LoopModel = require('./../models/loop.model');

/* LOG IN FIRST */
router.get('/', (req, res, next) => {
  res.render("auth/doctor-signin", {title: "MyTherapy | Doctor: sign-in"});
});

/* DASHBOARD -> SEE ALL PATIENTS */
router.get('/dashboard', (req, res, next) => {
  DoctorModel.findById(req.session.currentUser._id)
  .populate("myPatients")
  .then(dbRes => res.render("dashboardDoctor", { doctorInfo: dbRes, title: "MyTherapy | Doctor dashboard" }))
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
    res.redirect('/doctor/dashboard');
  })
  .catch(next);
});

module.exports = router;