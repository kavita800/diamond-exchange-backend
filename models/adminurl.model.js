const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
   
    url: { type: String, } 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Adminurl', schema);