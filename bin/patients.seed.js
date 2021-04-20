require("dotenv").config();
require("./../configs/dbconfig");
const PatientModel = require('./../models/patient.model');

const patients = [
  {
    name: "Rélu",
    lastname: "Mey",
    email: "relu@email.com",
    password: "123456789",
    phoneNumber: "1234567890",
    location: {
      address: "66 Fake Street",
      zipcode: "3A5 6K8",
      city: "Vancouver"
    },
    photo: "https://res.cloudinary.com/dcbzfldni/image/upload/v1615549011/oto1l9kz0znja8xwmozn.png",
    myTherapist: "604760230f87ef3a95376e05",
    myTherapy: "Cognitive-behavioral therapy (CBT)",
    myGoals: "I want to overcome Impostor Syndrome",
  },
  {
    name: "Enaïs",
    lastname: "Angler",
    email: "enais@email.com",
    password: "123456789",
    phoneNumber: "1234567890",
    location: {
      address: "46 Fake Street",
      zipcode: "3A5 6L8",
      city: "Montréal"
    },
    photo: "https://res.cloudinary.com/dcbzfldni/image/upload/v1615543701/jdpbkmg7rkyftmxpjp3x.jpg",
    myTherapist: "604760230f87ef3a95376e05",
    myTherapy: "Cognitive-behavioral therapy (CBT)",
    myGoals: "I want to reduce my stress",
  },
  {
    name: "Lathieu",
    lastname: "Mambertin",
    email: "lathieu@email.com",
    password: "123456789",
    phoneNumber: "1234567890",
    location: {
      address: "56 Fake Street",
      zipcode: "3A5 6J8",
      city: "Olouise"
    },
    photo: "https://res.cloudinary.com/dcbzfldni/image/upload/v1615543701/jdpbkmg7rkyftmxpjp3x.jpg",
    myTherapist: "604760230f87ef3a95376e05",
    myTherapy: "Cognitive-behavioral therapy (CBT)",
    myGoals: "I want to work on my confidence skills",
  }
];

PatientModel.create(patients)
.then(dbRes => console.log(dbRes))
.catch(err => console.log(err));