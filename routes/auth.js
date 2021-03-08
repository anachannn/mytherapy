const express = require("express");
const router = express.Router();
const PatientModel = require("./../models/patient.model");
const DoctorModel = require("./../models/doctor.model")
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');

//GET ROUTES

//Patient

router.get("/patient/signin", (req, res, next) => {
    res.render("auth/patient.signin");
  });
  
  router.get("/patient/signup", async (req, res, next) => {
    res.render("auth/patient.signup");
  });
  
  router.get("/patient/signout", async (req, res, next) => {
    req.session.destroy(function (err) {
      res.redirect("/patient/signin");
    });
  });

//Doctor

router.get("/doctor/signin", (req, res, next) => {
    res.render("auth/doctor.signin");
  });
  
  router.get("/doctor/signup", async (req, res, next) => {
    res.render("auth/doctor.signup");
  });
  
  router.get("/doctor/signout", async (req, res, next) => {
    req.session.destroy(function (err) {
      res.redirect("/doctor/signin");
    });
  });

//POST ROUTES

//Patient - Sign in

router.post("/patient/signin", async (req, res, next) => {
    
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email: email });
  
    if (!foundUser) {

      req.flash("error", "Invalid credentials");
      res.redirect("/patient/signin");

    } else {

      const isSamePassword = bcrypt.compareSync(password, foundUser.password);
      
      if (!isSamePassword) {
        
        req.flash("error", "Invalid credentials");
        res.redirect("/patient/signin");

      } else {
     
        const patientObject = foundUser.toObject();
        delete patientObject.password; 
        req.session.currentUser = patientObject;
        req.flash("success", "Successfully logged in...");
        res.redirect("/patient/dashboard");
      }
    }
  });

  // Patient - Sign up
  
  router.post("/patient/signup", async (req, res, next) => {
    try {
      const newUser = { ...req.body }; 

      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!regex.test(password)) {
        res
          .status(500)
          .render('auth/patient.signup', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
      }

        if(!name || !lastname || !email  || !password){
            res.render('/patient/signup', {errorMessage : 'Name, Lastname, Email and Password are mandatory. Please provide all of them.'});
            return;
        };

      const foundUser = await User.findOne({ email: newUser.email });
  
      if (foundUser) {
        req.flash("warning", "Email already registered");
        res.redirect("/patient/signup");

      } else {

        const hashedPassword = bcrypt.hashSync(newUser.password, 10);
        newUser.password = hashedPassword;
        await PatientModel.create(newUser);
        req.flash("success", "Congrats ! You are now registered !");
        res.redirect("/patient/signin");
      }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/patient.signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
            res.status(500).render('auth/patient.signup', {
               errorMessage: 'Name, Lastname and Email already used.'
            });
          } else {
            next(error);
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
    const foundUser = await User.findOne({ email: email });
  
    if (!foundUser) {
     
      req.flash("error", "Invalid credentials");
      res.redirect("/doctor/signin");

    } else {

      const isSamePassword = bcrypt.compareSync(password, foundUser.password);
      if (!isSamePassword) {
       
        req.flash("error", "Invalid credentials");
        res.redirect("/doctor/signin");

    } else {
     
        const doctorObject = foundUser.toObject();
        delete doctorObject.password;
        req.session.currentUser = doctorObject;
  
        req.flash("success", "Successfully logged in...");
        res.redirect("/doctor/dashboard");
      }
    }
  });

  // Doctor - Sign up
  
  router.post("/doctor/signup", async (req, res, next) => {
    try {
      const newUser = { ...req.body };

      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!regex.test(password)) {
        res
          .status(500)
          .render('auth/doctor.signup', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
      }

      if(!name || !lastname || !email  || !password){
        res.render('/doctor/signup', {errorMessage : 'Name, Lastname, Email and Password are mandatory. Please provide all of them.'});
        return;
    };

      const foundUser = await User.findOne({ email: newUser.email });
  
      if (foundUser) {

        req.flash("warning", "Email already registered");
        res.redirect("/doctor/signup");
        
      } else {

        const hashedPassword = bcrypt.hashSync(newUser.password, 10);
        newUser.password = hashedPassword;
        await DoctorModel.create(newUser);
        req.flash("success", "Congrats ! You are now registered !");
        res.redirect("/doctor/signin");
      }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/doctor.signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
            res.status(500).render('auth/doctor.signup', {
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