const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    match_id: { type: Number,default:null }, 
    match_name: { type: String,default:null  }, 
    open_date: { type: Date,default:null }, 
    countryCode: { type: String,default:null },
    series_id: { type: Number,default:null },  
    series_name: { type: String,default:null }, 
    sport_id: { type: Number,default:null },
    sport_type: { type: String,default:null },
    unmatch_bet: { type: String,default:'enable' },
    result_declare: { type: String, enum : ['yes','no'],default:'no' },
    rollback: { type: String, enum : ['yes','no'],default:'no' },
    createdDate: { type: Date,default: Date.now } ,
    
    
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Manualmatch', schema);