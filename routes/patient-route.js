require('./../configs/dbconfig');
require('./../configs/cloudinaryconfig');
const express = require('express');
const router = express.Router();
const PatientModel = require('./../models/patient.model');
const DoctorModel = require('./../models/doctor.model');
const TextModel = require('./../models/text.model');
const LoopModel = require('./../models/loop.model');

/* LOG IN FIRST */
router.get('/', (req, res, next) => {
  res.render("auth/patient.signin");
});

/* DASHBOARD -> SEE ALL DOCUMENTS */
router.get("/dashboard", (req, res, next) => {
  PatientModel.findById(patientObject.id)
  .populate("mytherapist mydocuments")
  .then(dbRes => {
    res.render("dashboardPatient", { patientInfo: dbRes });
  })
  .catch(next);
});

/* CREATE NEW "TEXT" ENTRY/DOCUMENT */
router.get("/add-document/text", (req, res, next) => {
  res.render("documents/createTextDocument");
});

router.post("/add-document/:type", (req, res, next) => {
  const { date, text } = req.body;
  TextModel.create({ date, text })
  .then(dbRes => {
    console.log("New document created!");
    res.redirect("/dashboard");
  })
  .catch(next);
});

/* CREATE NEW "LOOP" ENTRY/DOCUMENT */
router.get("/add-document/loop", (req, res, next) => {
  res.render("documents/createLoopDocument");
});

router.post("add-document/loop", (req, res, next) => {
  const {
    date,
    triggers,
    emotionalFeelings,
    bodyFeelings,
    thoughts,
    behaviors,
    chooseOneThought,
    whatElse,
    whatSomeone,
    whatOutsider,
    whatTwoYears,
    alternativeThoughts
  } = req.body;

  LoopModel.create({
    date,
    triggers,
    emotionalFeelings,
    bodyFeelings,
    thoughts,
    behaviors,
    chooseOneThought,
    whatElse,
    whatSomeone,
    whatOutsider,
    whatTwoYears,
    alternativeThoughts
  })
  .then(dbRes => {
    console.log("Document successfully created");
    res.redirect("/dashboard");
  })
  .catch(next);
});

module.exports = router;
