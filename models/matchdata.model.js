const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  
    sport_name: { type: String,  }, 
    match_id: { type: String,  }, 
    bm: { type: String,  }, 
    fancy: { type: String,  }, 
    inplay: { type: String,  }, 
    tv: { type: String,  }, 
    status: { type: String,  }, 
    status_fancy: { type: String,  }, 
    status_inplay: { type: String,  },  
    status_tv: { type: String,  }, 
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Matchdata', schema);