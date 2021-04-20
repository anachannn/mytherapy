require("dotenv").config();
require("./../configs/dbconfig");
const DoctorModel = require("./../models/doctor.model");

const doctors = [
  {
    name: "Dr. Jarl",
    lastname: "Cung",
    email: "marie.kehl@psymail.com",
    password: "$2a$10$kYZ30yDIxWyb.OGJISo37.WC6spizuGJXraWL1eIhZdAhA0H8foR.",
    phoneNumber: "123456789",
    location: {
      address: "123 fake street",
      zipcode: "90210",
      city: "Beverly Hills"
    },
    mySpecialty: "CDT",
    photo: "https://res.cloudinary.com/dcbzfldni/image/upload/v1615543512/o1okju1rs3kkhehelctx.jpg"
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
    mySpecialty: "CDT",
    photo: "https://res.cloudinary.com/dcbzfldni/image/upload/v1615579162/qs49i0jgrpivfisof0f2.png"
  }
];

DoctorModel.create(doctors)
.then(dbRes => console.log(dbRes))
.catch(err => console.log(err));