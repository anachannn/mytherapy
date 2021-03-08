const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
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
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true, 
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
    myspecialty:String,
    mypatients:[{
        type:Schema.Types.ObjectId,
        ref:'patients'  
    }]
    

});

const DoctorModel = mongoose.model('doctors', doctorSchema);
module.exports = DoctorModel;