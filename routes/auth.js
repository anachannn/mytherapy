const express = require("express");
const router = express.Router();
const PatientModel = require("./../models/patient.model");
const DoctorModel = require("./../models/doctor.model")
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');
const uploader = require("./../configs/cloudinaryconfig")

//GET ROUTES

//Patient

router.get("/patient/signin", (req, res, next) => {
    res.render("auth/patient-signin", { title: "MyTherapy | Sign-in"});
  });
  
  router.get("/patient/signup", async (req, res, next) => {
    const doctorsList = await DoctorModel.find();
    res.render("auth/patient-signup", { doctorsList, title: "MyTherapy | Sign up" });
  });
  
  router.get("/patient/signout", async (req, res, next) => {
    req.session.destroy(function (err) {
      res.redirect("/auth/patient/signin");
    });
  });

//Doctor

  router.get("/doctor/signin", (req, res, next) => {
    res.render("auth/doctor-signin", { title: "MyTherapy | Sign-in"});
  });
  
  router.get("/doctor/signup", (req, res, next) => {
    res.render("auth/doctor-signup", { title: "MyTherapy | Sign up"});
  });
  
  router.get("/doctor/signout", (req, res, next) => {
    req.session.destroy(function (err) {
      res.redirect("/auth/doctor/signin");
    });
  });

//POST ROUTES

//Patient - Sign in

router.post("/patient/signin", async (req, res, next) => {
    
    const { email, password } = req.body;
    const onePatient = { ...req.body }; 

    if(!onePatient.email || !onePatient.password){
      res.render('auth/patient-signin', { errorMessage : 'You have to fill the two elements to log in bitch!'});
      return;
    };

    const foundPatient = await PatientModel.findOne({ email: email });
  
    if (!foundPatient) {

      req.flash("error", "Invalid credentials");
      res.redirect("signin");

    } else {

      const isSamePassword = bcrypt.compareSync(password, foundPatient.password);
      
      if (!isSamePassword) {
        
        req.flash("error", "Invalid credentials");
        res.redirect("signin");

      } else {
     
        const patientObject = foundPatient.toObject();
        delete patientObject.password; 
        req.session.currentUser = patientObject;
        req.flash("success", "Successfully logged in...");
        res.redirect("/patient/dashboard");
      }
    }
  });

  // Patient - Sign up
  
  router.post("/patient/signup", uploader.single("photo"), async (req, res, next) => {
    try {
      const newPatient = { ...req.body }; 

      // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      // if (!regex.test(password)) {
      //   res
      //     .status(500)
      //     .render('auth/patient-signup', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
      //   return;
      // }

      if(!newPatient.name || !newPatient.lastname || !newPatient.email  || !newPatient.password){
        const doctorsList = await DoctorModel.find();
        res.render('auth/patient-signup', { doctorsList, title: "MyTherapy | Sign up", errorMessage : 'Name, Lastname, Email and Password are mandatory. Please provide all of them.'});
        return;
      };

      const foundPatient = await PatientModel.findOne({ email: newPatient.email });
  
      if (foundPatient) {
        req.flash("warning", "Email already registered");
        res.redirect("signup");

      } else {

        const hashedPassword = bcrypt.hashSync(newPatient.password, 10);
        newPatient.password = hashedPassword;
        if (!req.file) newPatient.photo = undefined;
        else {
            newPatient.photo = req.file.path
        };
        PatientModel.create(newPatient)
        .then(dbRes => {
          DoctorModel.findByIdAndUpdate(dbRes.myTherapist, { $push: {myPatients: dbRes._id} })
          .then(dbRes => console.log("New patient created: ", dbRes))
          .catch(err => console.log(err));

          req.flash("success", "Congrats ! You are now registered !");
          res.redirect("/auth/patient/signin");
        })
        
      }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/patient-signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
            res.status(500).render('auth/patient-signup', {
               errorMessage: 'Name, Lastname and Email already used.'
            });
          } else {
            next(error);
          }
      }
    //   Je ne sais pas quoi faire de ça...
    //   let errorMessage = "";
    //   for (field in err.errors) {
    //     errorMessage += err.errors[field].message + "\n";
    //   }
    //   req.flash("error", errorMessage);
    //   res.redirect("/patient/signup");
    // }
  });

//Doctor - Sign in


router.post("/doctor/signin", async (req, res, next) => {
   
    const { email, password } = req.body;
    const oneDoctor = {...req.body}

    if(!oneDoctor.email || !oneDoctor.password){
      res.render('auth/doctor-signin', {errorMessage : 'You have to fill the two elements to log in bitch!'});
      return;
    };

    const foundDoctor = await DoctorModel.findOne({ email: email });
  
    if (!foundDoctor) {
     
      req.flash("error", "Invalid credentials");
      res.redirect("signin");

    } else {

      const isSamePassword = bcrypt.compareSync(password, foundDoctor.password);
      if (!isSamePassword) {
       
        req.flash("error", "Invalid credentials");
        res.redirect("signin");

    } else {
     
        const doctorObject = foundDoctor.toObject();
        delete doctorObject.password;
        req.session.currentUser = doctorObject;
  
        req.flash("success", "Successfully logged in...");
        res.redirect("/doctor/dashboard");
      }
    }
  });

  // Doctor - Sign up
  
  router.post("/doctor/signup", uploader.single("photo"), async (req, res, next) => {
    try {
      const newDoctor = { ...req.body };
      // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      // if (!regex.test(password)) {
      //   res
      //     .status(500)
      //     .render('auth/doctor-signup', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
      //   return;
      // }

      if(!newDoctor.name || !newDoctor.lastname || !newDoctor.email  || !newDoctor.password){
        res.render('auth/doctor-signup', {errorMessage : 'Name, Lastname, Email and Password are mandatory. Please provide all of them.'});
        return;
      };

      const foundDoctor = await DoctorModel.findOne({ email: newDoctor.email });
  
      if (foundDoctor) {

        req.flash("warning", "Email already registered");
        res.redirect("signup");
        
      } else {

        const hashedPassword = bcrypt.hashSync(newDoctor.password, 10);
        newDoctor.password = hashedPassword;
        if (!req.file) newDoctor.photo = undefined;
        else {
            newDoctor.photo = req.file.path
        };
        await DoctorModel.create(newDoctor);
        req.flash("success", "Congrats ! You are now registered !");
        res.redirect("/auth/doctor/signin");
      }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/doctor-signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
            res.status(500).render('auth/doctor-signup', {
               errorMessage: 'Name, Lastname and Email already used.'
            });
          } else {
            next(error);
          }}
    //   Je ne sais pas quoi faire de ça...
    //   let errorMessage = "";
    //   for (field in err.errors) {
    //     errorMessage += err.errors[field].message + "\n";
    //   }
    //   req.flash("error", errorMessage);
    //   res.redirect("/patient/signup");
    // }
  });

module.exports = router;