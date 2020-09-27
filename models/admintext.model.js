const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_text: { type: String  }, 
    admin_text: { type: String  }, 
    createdDate: { type: Date, default: Date.now } ,
   
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Admintext', schema);