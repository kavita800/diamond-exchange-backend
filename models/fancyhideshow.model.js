const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    market_id: { type: String,  },  
    match_id: { type: String, }, 
    hide: { type: String, }, 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Fancyhideshow', schema);