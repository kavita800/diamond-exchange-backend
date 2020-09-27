const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    
    event_id: { type: Number ,default:null }, 
    event_name: { type: String ,default:null }, 
    win_team: { type: String  ,default:null}, 
    looser_team: { type: String,default:null  }, 
    sport_type:{type: String,default:null},
    win_team_selectionid :{ type: String ,default:null }, 
    loss_team_selectionid: { type: String,default:null  },
    winner_by_api: { type: String,default:null  },
    market_id: { type: Number,default:null  },
    createdDate: { type: Date, default: Date.now } 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Matchdeclare', schema);