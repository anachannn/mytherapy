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
  res.render("auth/patient-signin");
});

/* DASHBOARD -> SEE ALL DOCUMENTS */
router.get("/dashboard", (req, res, next) => {
  PatientModel.findById(req.session.currentUser._id)
  .populate("mytherapist mytexts myloops")
  .then(dbRes => {
    res.render("dashboardPatient", { patientInfo: dbRes });
  })
  .catch(next);
});

/* CREATE NEW ENTRY/DOCUMENT */
router.get("/add-document/:type", (req, res, next) => {
  if (type === "text") res.render("documents/createTextDocument");
  else if (type === "loop") res.render("documents/createLoopDocument");
});

router.post("/add-document/:type", (req, res, next) => {
  const patientId = req.session.currentUser._id;
  if(type === "text") {
    const { date, text } = req.body;
    TextModel.create({ patientId, date, text })
    .then(dbRes => {
      console.log("New document created!");
      res.redirect("/dashboard");
    })
    .catch(next);
  } else if (type === "loop") {
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
        patientId,
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
  }
  // SEND NOTIFICATION TO DOCTOR
});

/* UPDATE ENTRY/DOCUMENT */
router.get("/edit-document/:type", (req, res, next) => {
  if (type === "text") res.render("documents/updateTextDocument");
  else if (type === "loop") res.render("documents/updateLoopDocument");
});

router.post("/edit-document/:type", (req, res, next) => {
  if(type === "text") {
    const { date, text } = req.body;
    TextModel.findByIdAndCreate(req.params.id, { date, text })
    .then(dbRes => {
      console.log("Document updated!");
      res.redirect("/dashboard");
    })
    .catch(next);
  } else if (type === "loop") {
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
    
      LoopModel.findByIdAndUpdate(req.params.id, {
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
        console.log("Document successfully updated");
        res.redirect("/dashboard");
      })
      .catch(next);
  }
  // SEND NOTIFICATION TO DOCTOR ?
});


/* DELETE ENTRY/DOCUMENT */
router.get('/document-delete/:type', (req, res, next) => {
  if(type === "text") {
    TextModel.findByIdAndDelete(req.params.id)
    .then(dbRes => {
      console.log("Document successfully deleted");
      res.redirect("/dashboard");
    })
    .catch(next);
  } else if (type === "loop") {
      LoopModel.findByIdAndDelete(req.params.id)
      .then(dbRes => {
        console.log("Document successfully deleted");
        res.redirect("/dashboard");
      })
  }
})

module.exports = router;
