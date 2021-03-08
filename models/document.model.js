const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    patientId:{
        type:Schema.Types.ObjectId,
        ref:'patients'
    },
    title:{
        type:String, 
        required:true
    },
    strategy:{
        type:Schema.Types.ObjectId,
        ref:'strategies',
        required:true,
        default:'Journaling'
    },
    typeofdocs:{
        type:String,
        enum:['Text', 'Loop', 'One-to-one','Breathing techniques']
    },
    

});

const DocumentModel = mongoose.model('documents', documentSchema);
module.exports = DocumentModel;
