const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:[true, 'Email is required.'],
        match:[/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: String,
    location: {
        address: {
          type: String,
          default: ""
        },
        zipcode: {
          type: String,
          default: ""
        },
        city: {
          type: String,
          default: ""
        }
    },
    photo:{
        type: String,
        default: "https://res.cloudinary.com/dcbzfldni/image/upload/v1615194613/MyTherapy/empty_avatar_jpluej.jpg"
    },
    myTherapist: {
        type: Schema.Types.ObjectId,
        ref: 'doctors',
        required: true
    },
    myTherapy: {
        type: String,
        enum: ['Psychoanalytic therapy', 'Cognitive-behavioral therapy (CBT)', 'Group therapy'],
        default: 'Cognitive-behavioral therapy (CBT)'
    },
    myGoals: String,
    myTexts: [{
        type: Schema.Types.ObjectId,
        ref: 'texts'
    }],
    myLoops: [{
        type: Schema.Types.ObjectId,
        ref: 'loops'
    }]
});

const PatientModel = mongoose.model('patients', patientSchema);
module.exports = PatientModel;