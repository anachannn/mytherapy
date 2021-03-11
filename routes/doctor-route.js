require('./../configs/dbconfig');
require('./../configs/cloudinaryconfig');
const express = require("express");
const router = express.Router();
const PatientModel = require('./../models/patient.model');
const DoctorModel = require('./../models/doctor.model');
const TextModel = require('./../models/text.model');
const LoopModel = require('./../models/loop.model');
//const axios = require('axios');

/* LOG IN FIRST */
router.get('/', (req, res, next) => {
  res.render("auth/doctor-signin", {title: "MyTherapy | Doctor: sign-in"});
});

/* DASHBOARD -> SEE ALL PATIENTS */
router.get('/dashboard', (req, res, next) => {
  DoctorModel.findById(req.session.currentUser._id)
  .populate("myPatients")
  .then(dbRes => res.render("dashboardDoctor", { doctorInfo: dbRes, title: "MyTherapy | Doctor dashboard", script: "/scripts/doctor.js" }))
  .catch(next);
});

/* UPDATE DOCTOR'S PROFILE */
router.get('/edit-profile/:id', (req, res, next) => {
  DoctorModel.findById(req.params.id)
  .populate("myPatients")
  .then(dbRes => {
    console.log(dbRes);
    res.render("editDoctorProfile", {doctorInfo: dbRes, title: "MyTherapy | Doctor - Edit your profile"});
  })
  .catch(next);
});

router.post('/edit-profile/:id', (req, res, next) => {
  console.log("req.body: ", req.body);
  DoctorModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(dbRes => {
    console.log("Profile successfully edited! ", dbRes);
    res.redirect("/doctor/dashboard");
  })
  .catch(next);
});


/* DELETE DOCTOR'S PROFILE */
router.get('/delete/:id', (req, res, next) => {
  DoctorModel.findById(req.params.id)
  .then(foundDoctor => {
    if (foundDoctor.myPatients.length === 0) {
      DoctorModel.findByIdAndDelete(foundDoctor._id)
      .then(() => {
        console.log("Doctor successfully deleted");
        res.redirect("/auth/doctor/signout");
      })
      .catch(next);
    } else {
      res.render("doctorDashboard", { errorMessage: "Don't delete your profile without telling your patients to find another doctor, please!"});
      res.redirect("/doctor/dashboard");
    }
  })
})

/*CLICK ON PATIENT TO DISPLAY THEIR DOCS*/

router.get("/api/patient/:id", (req, res, next) => {
  
  PatientModel.findById(req.params.id)
   .populate('myTexts myLoops')
   .then(dbRes => {
     res.send(dbRes)
   })
   .catch(next);
})

/*READ PATIENT DOCUMENTS*/


  router.get("/read-document/:type/:id", (req, res, next) => {
    if (req.params.type === "text") {
      TextModel.findById(req.params.id)
      .then(textToRead => res.render("documents/doctorReadText", {text: textToRead, title: "MyTherapy | Read this document"}))
      .catch(next);
    }
    else if (req.params.type === "loop") {
      LoopModel.findById(req.params.id)
      .then(loopToRead => res.render("documents/doctorReadLoop", {loop: loopToRead, title: "MyTherapy | Read this document"}))
      .catch(next);
    }
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