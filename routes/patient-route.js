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
    .populate("myTherapist myTexts myLoops")
    .then(dbRes => res.render("dashboardPatient", { patientInfo: dbRes }))
    .catch(next);
});

/* EDIT PROFILE */
router.get('/edit-profile/:id', (req, res, next) => {
  let doctorsList;
  DoctorModel.find()
  .then(dbRes => {
    doctorsList = dbRes;
    PatientModel.findById(req.params.id)
    .populate("myTherapist")
    .then(dbRes => res.render("editPatientProfile", { patientInfo: dbRes, doctorsList }))
    .catch(next);
  })
  .catch(next);  
});

// router.get('/edit-profile/:id', async (req, res, next) => {
//   try {
//     const doctorsList = await DoctorModel.find();
//     console.log(doctorsList);
//     const patientInfo = await PatientModel.findById(req.params.id);
//     res.render("editPatientProfile", { patientInfo, doctorsList });
//   } catch(err) {
//     next(err);
//   }
// });

router.post('/edit-profile/:id', (req, res, next) => {
  let currentDoctor, newDoctor;
  PatientModel.find(req.params.id)
  .then(dbRes => currentDoctor = dbRes.myTherapist)
  .catch(err => console.log(err));

  newDoctor = req.body.myTherapist;
  console.log("current doctor:", currentDoctor);
  console.log("new doctor: ", newDoctor);

  const { name, lastname, email, phoneNumber, myTherapist, myTherapy, myGoals } = req.body;
  PatientModel.findByIdAndUpdate(req.params.id, {
    name,
    lastname,
    email,
    phoneNumber,
    location: {
      address: req.body.address,
      zipcode: req.body.zipcode,
      city: req.body.city
    },
    myTherapist,
    myTherapy,
    myGoals
    }, {new: true})
  .then(dbRes => {
    console.log("Profile successfully edited! ", dbRes);
    res.redirect("/patient/dashboard");
  })
  .catch(next);
});

/* CREATE NEW ENTRY/DOCUMENT */
// axios.get("/add-document")

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
      res.redirect("/patient/dashboard");
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
        res.redirect("/patient/dashboard");
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
      res.redirect("/patient/dashboard");
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
        res.redirect("/patient/dashboard");
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
      res.redirect("/patient/dashboard");
    })
    .catch(next);
  } else if (type === "loop") {
      LoopModel.findByIdAndDelete(req.params.id)
      .then(dbRes => {
        console.log("Document successfully deleted");
        res.redirect("/patient/dashboard");
      })
      .catch(next);
  }
});

module.exports = router;
