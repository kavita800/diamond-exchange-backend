const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default:null},  
    value_1:{ type: String },
    value_2:{ type: String },
    value_3:{ type: String },
    value_4:{ type: String },
    value_5:{ type: String },
    value_6:{ type: String },
    value_7:{ type: String },
    value_8:{ type: String },
    value_9:{ type: String },
    value_10:{ type: String },
    button_1:{ type: String },
    button_2:{ type: String },
    button_3:{ type: String },
    button_4:{ type: String },
    button_5:{ type: String },
    button_6:{ type: String },
    button_7:{ type: String },
    button_8:{ type: String },
    button_9:{ type: String },
    button_10:{ type: String },
    createdDate: { type: Date, default: Date.now } ,
    
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Buttonvalue', schema);