const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
   
	browser_name:{ type: String },
	version:{ type: String },
	os:{ type: String },
	ip_address:{ type: String },
	createdDate: { type: Date, default: Date.now } ,
	user_id: { type: Schema.Types.ObjectId, ref: 'User', default:null},  

});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Browser', schema);