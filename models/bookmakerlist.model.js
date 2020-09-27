const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    match_id: { type: Number ,default:null }, 
    market_id: { type: Number ,default:null }, 
    match_name: { type: String ,default:null }, 
	series_id: { type: Number ,default:null }, 
    series_name: { type: String ,default:null }, 
    first_team_back: { type: Number,default:null  }, 
    first_team_lay: { type: Number,default:null }, 
    first_team_suspend: { type: String,enum: [true,false], default: false }, 
    second_team_back: { type: Number,default:null },  
    second_team_lay: { type: Number,default:null }, 
	second_team_suspend: { type: String,enum: [true,false], default: false }, 
	draw_back: { type: Number,default:null },  
    draw_lay: { type: Number,default:null }, 
	draw_team_suspend: { type: String,enum: [true,false], default: false },
    sport_id: { type: Number ,default:null },
    sport_type: { type: String ,default:null },
	min_bookmaker_limit: { type: Number,default:null  },
	max_bookmaker_limit: { type: Number,default:null  },
	enable_draw: { type: String ,enum: [true,false], default: false },
    status: { type: String ,enum: ['enable','disable'], default: 'enable' },
    createdDate: { type: Date, default: Date.now } 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Bookmakerlist', schema);