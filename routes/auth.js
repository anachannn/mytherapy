const express = require("express");
const router = express.Router();
const PatientModel = require("./../models/patient.model");
const DoctorModel = require("./../models/doctor.model")
const bcrypt = require("bcryptjs");

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

//Patient

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
  
  router.post("/patient/signup", async (req, res, next) => {
    try {
      const newUser = { ...req.body }; 

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
    } catch (err) {
      let errorMessage = "";
      for (field in err.errors) {
        errorMessage += err.errors[field].message + "\n";
      }
      req.flash("error", errorMessage);
      res.redirect("/patient/signup");
    }
  });

//Doctor


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
  
  router.post("/doctor/signup", async (req, res, next) => {
    try {
      const newUser = { ...req.body };

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
    } catch (err) {
      let errorMessage = "";
      for (field in err.errors) {
        errorMessage += err.errors[field].message + "\n";
      }
      req.flash("error", errorMessage);
      res.redirect("/doctor/signup");
    }
  });

module.exports = router;