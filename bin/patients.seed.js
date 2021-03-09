require("dotenv").config();
require("./../configs/dbconfig");
const PatientModel = require('./../models/patient.model');

const patients = [
  {
    name: "Mélu",
    lastname: "Rey",
    email: "melu@email.com",
    password: "123456789",
    phoneNumber: "1234567890",
    location: {
      address: "66 Fake Street",
      zipcode: "3A5 6K8",
      city: "Vancouver"
    },
    photo: "https://res.cloudinary.com/dcbzfldni/image/upload/v1615299075/MyTherapy/animaniacs_feat_freakazoid_bkjgtr.jpg",
    myTherapist: "604760230f87ef3a95376e05",
    myTherapy: "Cognitive-behavioral therapy (CBT)",
    myGoals: "I want to overcome Impostor Syndrome",
  }
];

PatientModel.create(patients)
.then(dbRes => console.log(dbRes))
.catch(err => console.log(err));