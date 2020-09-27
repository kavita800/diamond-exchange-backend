const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default:null},  
    event_id: { type: Number  }, 
    event_name: { type: String  },
    event_type: { type: String  },
    no_amount: { type: Number },
    yes_amount: { type: Number },
    no: { type: String },
    yes: { type: String },
    betMarketId:{ type: String },
    stake:{ type: String },
    createdDate: { type: Date, default: Date.now } ,
    
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Userbetsession', schema);