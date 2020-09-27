const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    market_id: { type: String,default:null  },  
    event_id: { type: String,default:null }, 
    event_type: { type: String,default:null }, 
    event_name: { type: String,default:null }, 
    fancy_name: { type: String,default:null }, 
    lay_price: { type: String,default:null}, 
    lay_size: { type: String,default:null},
	back_price: { type: String,default:null}, 
    back_size: { type: String,default:null},	
    is_active: { type: String,default:"yes" }, 
    is_suspended: { type: String,default:"no" }, 
    result_score: { type: String,default:null }, 
	result_declare: { type: String, enum : ['yes','no'],default:'no' },
    createdDate: { type: Date } 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Fancylist', schema);