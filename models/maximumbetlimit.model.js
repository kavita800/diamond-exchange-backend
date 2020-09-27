const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    
    event_id: { type: String, required: true }, 
    event_name: { type: String, required: true }, 
    maximum_bet_limit: { type: String }, 
    minimum_bet_limit: { type: String }, 
	fancy_maximum_bet_limit: { type: String }, 
    fancy_minimum_bet_limit: { type: String }, 
	bookmaker_maximum_bet_limit: { type: String }, 
    bookmaker_minimum_bet_limit: { type: String }, 
    createdDate: { type: Date, default: Date.now } 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Maximumbetlimit', schema);