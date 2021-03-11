require('./../configs/dbconfig');
require('./../configs/cloudinaryconfig');
const express = require('express');
const router = express.Router();
const PatientModel = require('./../models/patient.model');
const DoctorModel = require('./../models/doctor.model');
const TextModel = require('./../models/text.model');
const LoopModel = require('./../models/loop.model');
let currentDoctor, newDoctor;
const moment = require("moment"); // usefull to format date

/* LOG IN FIRST */
router.get('/', (req, res, next) => {
  res.render("auth/patient-signin", {title: "MyTherapy | Patient: sign-in"});
});

/* DASHBOARD -> SEE ALL DOCUMENTS */
router.get("/dashboard", (req, res, next) => {
  PatientModel.findById(req.session.currentUser._id)
    .populate("myTherapist myTexts myLoops")
    .then(dbRes => {
      res.render("dashboardPatient", { patientInfo: dbRes, title: "MyTherapy | Patient dashboard" });
    })
    .catch(next);
});

/* EDIT PROFILE */
router.get('/edit-profile/:id', (req, res, next) => {
  let doctorsList;
  DoctorModel.find()
  .then(dbRes => {
    doctorsList = dbRes;
    PatientModel.findById(req.params.id)
    .populate("myTherapist myTexts myLoops")
    .then(dbRes => {
      currentDoctor = dbRes.myTherapist._id;
      res.render("editPatientProfile", { patientInfo: dbRes, doctorsList })
    })
    .catch(next);
  })
  .catch(next);  
});

router.post('/edit-profile/:id', (req, res, next) => {
  PatientModel.findById(req.params.id)
  .then(editRes => {
    newDoctor = req.body.myTherapist;
    if (newDoctor !== currentDoctor) {
      DoctorModel.findByIdAndUpdate(currentDoctor, { $pull: {myPatients: editRes._id} })
      .then(() => {
        DoctorModel.findByIdAndUpdate(newDoctor, { $push: {myPatients: editRes.id} })
        .then(console.log(editRes))
        .catch(next);
      })
      .catch(next);
    }
  })
  .catch(err => console.log(err));

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

router.get("/delete/:id", (req, res, next) => {
  PatientModel.findById(req.params.id)
  .then(dbRes => {
    console.log("dbRes: ", dbRes);
    if (dbRes.myTexts.length > 0) {
      dbRes.myTexts.forEach(item => {
        TextModel.findByIdAndDelete(item)
        .then(console.log("Text document deleted"))
        .catch(next);
      });
    }
    if (dbRes.myLoops.length > 0) {
      dbRes.myLoops.forEach(item => {
        LoopModel.findByIdAndDelete(item)
        .then(console.log("Loop document deleted"))
        .catch(next);
      });
    }
    DoctorModel.findByIdAndUpdate(dbRes.myTherapist._id, { $pull: {myPatients: dbRes._id} })
    .then(() => {
      PatientModel.findByIdAndDelete(req.params.id)
      .then(deleteRes => console.log("Patient successfully deleted"))
      .catch(next);
    })
    .catch(next);
  })
  .catch(next);
  res.redirect("/auth/patient/signout");
});

/* --------------- DOCUMENTS --------------- */
/* CREATE NEW ENTRY/DOCUMENT */
router.get("/add-doc", (req, res, next) => {
  res.render("documents/createDocument", {title: "MyTherapy | Create document"})
});

router.get("/create-text", (req, res, next) => {
  res.render("documents/createTextDocument", {title: "MyTherapy | Create a new text document"})
});

router.get("/create-loop", (req, res, next) => {
  res.render("documents/createLoopDocument", {title: "MyTherapy | Create a new loop document"})
});

router.post("/add-document/:type", (req, res, next) => {
  console.log(req.params);
  const patientId = req.session.currentUser._id;
  console.log(patientId);
  if(req.params.type === "text") {
    const { date, title, text } = req.body;
    moment(date).format("YYYY-MM-DD");

    TextModel.create({ patientId, date, title, text })
    .then(dbRes => {
      PatientModel.findByIdAndUpdate(patientId, { $push: {myTexts: dbRes._id} })
      .then(dbRes => console.log("New document created!"))
      .catch(next);
      res.redirect("/patient/dashboard/");
    })
    .catch(next);
  } else if (req.params.type === "loop") {
      console.log("inside if loop");
      const {
        date,
        title,
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
    
      moment(date).format("YYYY-MM-DD");
      LoopModel.create({
        patientId,
        date,
        title,
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
        PatientModel.findByIdAndUpdate(patientId, { $push: {myLoops: dbRes._id} })
        .then(dbRes => console.log("New document created!"))
        .catch(next);
        res.redirect("/patient/dashboard/");
      })
      .catch(next);
  }
  // SEND NOTIFICATION TO DOCTOR
});

router.get("/read-document/:type/:id", (req, res, next) => {
  if (req.params.type === "text") {
    TextModel.findById(req.params.id)
    .then(textToRead => res.render("documents/readTextDocument", {text: textToRead, title: "MyTherapy | Read your text document"}))
    .catch(next);
  }
  else if (req.params.type === "loop") {
    LoopModel.findById(req.params.id)
    .then(loopToRead => res.render("documents/readLoopDocument", {loop: loopToRead, title: "MyTherapy | Read your loop document"}))
    .catch(next);
  }
});


/* UPDATE ENTRY/DOCUMENT */
router.get("/edit-document/:type/:id", (req, res, next) => {
  if (req.params.type === "text") {
    TextModel.findById(req.params.id)
    .then(textToUpdate => res.render("documents/editTextDocument", {text: textToUpdate, title: "MyTherapy | Update text document"}))
    .catch(next);
  }
  else if (req.params.type === "loop") {
    LoopModel.findById(req.params.id)
    .then(loopToUpdate => res.render("documents/editLoopDocument", {loop: loopToUpdate, title: "MyTherapy | Update loop document"}))
    .catch(next);
  }
});

router.post("/edit-document/:type/:id", (req, res, next) => {
  console.log("req.params: ", req.params);
  if(req.params.type === "text") {
    const { date, title, text } = req.body;
    TextModel.findByIdAndUpdate(req.params.id, { date, title, text })
    .then(dbRes => {
      console.log("Document updated! ", dbRes);
      res.redirect("/patient/dashboard");
    })
    .catch(next);
  } else if (req.params.type === "loop") {
      const {
        date,
        title,
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
        title,
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
        console.log("Document successfully updated! ", dbRes);
        res.redirect("/patient/dashboard");
      })
      .catch(next);
  }
  // SEND NOTIFICATION TO DOCTOR ?
});


/* DELETE ENTRY/DOCUMENT */
router.get('/document-delete/:type/:id', (req, res, next) => {
  if(req.params.type === "text") {
    TextModel.findById(req.params.id)
    .then(textToDelete => {
      PatientModel.findByIdAndUpdate(textToDelete.patientId, { $pull: {myTexts: textToDelete._id}})
      .then(console.log("Text document deleted"))
      .catch(next);
    })
    .then(dbRes => {
      TextModel.findByIdAndDelete(req.params.id)
      .then(dbRes => {
      console.log("Document successfully deleted");
      res.redirect("/patient/dashboard");
      })
      .catch(next);
    })
    .catch(next);
    
  } else if (req.params.type === "loop") {
    LoopModel.findById(req.params.id)
    .then(loopToDelete => {
      PatientModel.findByIdAndUpdate(loopToDelete.patientId, { $pull: {myLoops: loopToDelete._id}})
      .then(console.log("Loop document deleted"))
      .catch(next);
    })
    .then(dbRes => {
      LoopModel.findByIdAndDelete(req.params.id)
      .then(dbRes => {
        console.log("Document successfully deleted");
        res.redirect("/patient/dashboard");
      })
      .catch(next);
    })
    .catch(next);
  }
});

module.exports = router;
