const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loopSchema = new Schema({
    date:{
        type:Date,
        default:Date.now()
    },
   
    triggers:String,
    emotionalFeelings:String,
    bodyFeelings:String,
    thoughts:String,
    behaviors:String,
    chooseOneThought:String,
    whatElse:String,
    whatSomeone:String,
    whatOutsider:String,
    whatTwoYears:String,
    alternativeThoughts:String,


});

const LoopModel = mongoose.model('loops', loopSchema);
module.exports = LoopModel;