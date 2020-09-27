const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    
    event_id: { type: Number  }, 
    status: { type: Number  }, 
    type:{ type: String  }, 
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default:null},  
    createdDate: { type: Date, default: Date.now } 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Betlock', schema);