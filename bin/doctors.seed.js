require("dotenv").config();
require("./../configs/dbconfig");
const DoctorModel = require("./../models/doctor.model");

const doctors = [
  {
    name: "Dr. Marie",
    lastname: "Kehl",
    email: "marie.kehl@psymail.com",
    password: "$2a$10$kYZ30yDIxWyb.OGJISo37.WC6spizuGJXraWL1eIhZdAhA0H8foR.",
    phoneNumber: "123456789",
    location: {
      address: "123 fake street",
      zipcode: "90210",
      city: "Beverly Hills"
    },
    mySpecialty: "CDT"
  },
  {
    name: "Dr. Sigmund",
    lastname: "Freud",
    email: "sigmund@psymail.com",
    password: "$2a$10$kYZ30yDIxWyb.OGJISo37.WC6spizuGJXraWL1eIhZdAhA0H8foR.",
    phoneNumber: "123456789",
    location: {
      address: "125 fake street",
      zipcode: "90210",
      city: "Beverly Hills"
    },
    mySpecialty: "CDT"
  }
];

DoctorModel.create(doctors)
.then(dbRes => console.log(dbRes))
.catch(err => console.log(err));