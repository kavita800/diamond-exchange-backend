const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    
    event_id: { type: String  }, 
    status: { type: Number  }, 
    createdDate: { type: Date, default: Date.now } 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('suspend', schema);