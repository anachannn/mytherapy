const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const strategySchema = new Schema({
    typeofstrategy:{
        type:String,
        enum:['Journaling', 'Role playing', 'Relaxation techniques', 'Mental distraction'],
    }
   
});

const StrategyModel = mongoose.model('strategies', strategySchema);
module.exports = StrategyModel;