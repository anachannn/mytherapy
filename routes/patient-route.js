require('./../configs/dbconfig');
require('./../configs/cloudinaryconfig');
const express = require('express');
const router = express.Router();
const PatientModel = require('./../models/patient.model');
const DocumentModel = require('./../models/document.model');
const StrategyModel = require('./../models/strategy.model');
const TextModel = require('./../models/text.model');
const LoopModel = require('./../models/loop.model');

/* LOG IN FIRST */
router.get('/', (req, res, next) => {
  res.render("auth/patient.signin");
});

/* CREATE NEW ENTRY */
router.get("/add-document/text", (req, res, next) => {
  res.render("createTextDocument");
});

router.post("/add-document", (req, res, next) => {

  DocumentModel.create()
  .then(dbRes => {
    console.log("New document created!");
    res.redirect("dashboard");
  })
  .catch(next);
});

/* DASHBOARD -> SEE ALL DOCUMENTS */
router.get("/dashboard", (req, res, next) => {
  PatientModel.findById(patientObject.id)
  .populate("mytherapist mydocuments")
  .then(dbRes => {
    res.render("patientPage", { patientInfo: dbRes });
  })
  .catch(next);
})

module.exports = router;
