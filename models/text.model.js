const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const textSchema = new Schema({
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
   
    text: {
        type: String,
        required: true
    },
    docType: {
      type: String,
      default: "text"
    }
});

const TextModel = mongoose.model('texts', textSchema);
module.exports = TextModel;