const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const textSchema = new Schema({
    date:{
        type:Date,
        default:Date.now()
    },
   
    text:{
        type:String,
        required:true
    }
});

const TextModel = mongoose.model('texts', textSchema);
module.exports = TextModel;