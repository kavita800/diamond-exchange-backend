const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    match_id: { type: Number ,default:null }, 
    market_id: { type: Number ,default:null }, 
    match_name: { type: String,default:null  }, 
    open_date: { type: Date,default:null }, 
    series_id: { type: Number,default:null },  
    series_name: { type: String,default:null }, 
    sport_id: { type: Number ,default:null },
    sport_type: { type: String ,default:null },
    winner_id: { type: Number ,default:null },
    winner_name: { type: String ,default:null },
    looser_id: { type: Number ,default:null },
    looser_name: { type: String ,default:null },
    winner: { type: String ,default:null },
    result_json: { type: String ,default:null },
	result_declare: { type: String, enum : ['yes','no'],default:'no' },
    createdDate: { type: Date, default: Date.now } 
    
    
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Matchlist', schema);