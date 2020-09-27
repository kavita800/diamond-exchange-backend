const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: { type: Number, required: true },  
    name: { type: String, required: true }, 
    game_status: { type: String, enum: ['Y','N'], default: 'Y' }, 
    createdDate: { type: Date, default: Date.now } 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Gametype', schema);