const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default:null},  	
    amount: { type: Number, required: true }, 
    trans_type: { type: String, required: true }, 
    remark: { type: String }, 
    amount_given_by: { type: Schema.Types.ObjectId, ref: 'User', default:null},
	userbet_id: { type: Schema.Types.ObjectId, ref: 'Userbet', default:null}, 
	event_id: { type: Number, required: true }, 
    createdDate: { type: Date,default: Date.now } 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Admintransaction', schema);