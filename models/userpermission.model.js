const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default:null},  
    permission_name: { type: String  }, 
    createdDate: { type: Date, default: Date.now } ,

});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Userpermission', schema);