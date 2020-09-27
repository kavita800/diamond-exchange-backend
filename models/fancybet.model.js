const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: String, required: true },  
    title: { type: String, required: true }, 
    yes_first: { type: String, required: true }, 
    yes_second: { type: String, required: true }, 
    no_first: { type: String, required: true },   
    no_second: { type: String, required: true }, 
    minimum: { type: String, required: true }, 
    maximum: { type: String },  
    createdDate: { type: Date } 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Fancybet', schema);