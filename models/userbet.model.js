const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default:null},  
    event_id: { type: Number  }, 
    event_name: { type: String  },
    event_type: { type: String  },
    odds: { type: String },  
    stake: { type: String },
    profit: { type: String },
    profit_team:{ type: String},
    loss_team:{ type: String},
    loss: { type: String },
    bet_type: { type: String }, 
    team_name: { type: String }, 
    selection_id: { type: String }, 
    market_id: { type: String },
    current_market_odds:{ type: String },
    type : { type:String, enum : ['match','unmatch'], default: 'unmatch'},
    status : { type:String, enum : ['pending','completed','deleted'], default: 'pending'},
	delete_by : { type: Schema.Types.ObjectId, ref: 'User', default:null}, 
    createdDate: { type: Date, default: Date.now } ,
    matchDate: { type: Date, } ,
    no_amount: { type: String },
    yes_amount: { type: String },
	back_price:{type: String},
	back_size:{type: String},
	lay_price:{type: String},
	lay_size:{type: String},
    no: { type: String },
    yes: { type: String },
    betMarketId:{ type: String },
    headname :{ type: String },
    color :{ type: String },
    key_index :{ type: String },
    casnio_type:{ type: String },
    bet_on:{ type: String,default:null},
    exposure: { type: Number  }, 
	draw_found : { type:String, enum : ['yes','no'], default: 'no'}
});
 
schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Userbet', schema);