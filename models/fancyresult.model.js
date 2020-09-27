const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    market_id: { type: String,  },  
    match_id: { type: String, }, 
    oods: { type: String}, 
    type: { type: String }, 
    createdDate: { type: Date } 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Fancyresult', schema);