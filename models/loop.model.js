const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loopSchema = new Schema({
    patientId:{
      type:Schema.Types.ObjectId,
      ref:'patients'
    },
    title:{
        type:String, 
        required:true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    triggers: String,
    emotionalFeelings: String,
    bodyFeelings: String,
    thoughts: String,
    behaviors: String,
    chooseOneThought: String,
    whatElse: String,
    whatSomeone: String,
    whatOutsider: String,
    whatTwoYears: String,
    alternativeThoughts: String,
    docType: {
      type: String,
      default: "loop"
    }
});

const LoopModel = mongoose.model('loops', loopSchema);
module.exports = LoopModel;