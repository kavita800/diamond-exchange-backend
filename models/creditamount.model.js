const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: String, required: true },  
    amount: { type: Number,default: 0}, 
    createdDate: { type: Date } ,
    amount_given_by: { type: Schema.Types.ObjectId, ref: 'User', default:null},

});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Creditamount', schema);