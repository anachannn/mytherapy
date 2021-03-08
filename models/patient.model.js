const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:[true, 'Email is required.'],
        match:[/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
    phonenumber:String,
    location:{
        adress:String,
        zipcode:String,
        city:String
    },
    photo:{
        type:String,
        default:"https://res.cloudinary.com/dcbzfldni/image/upload/v1615194613/MyTherapy/empty_avatar_jpluej.jpg"
    },
    mytherapist:{
        type:Schema.Types.ObjectId,
        ref:'doctors'
    },
    mytherapy:{
        type:String,
        enum:['Psychoanalytic therapy', 'Cognitive-behavioral therapy (CBT)', 'Group therapy'],
        default:'Cognitive-behavioral therapy (CBT)'
    },
    mygoals:String,
    mydocuments:[{
        type:Schema.Types.ObjectId,
        ref:'documents'
    }]
});

const PatientModel = mongoose.model('patients', patientSchema);
module.exports = PatientModel;