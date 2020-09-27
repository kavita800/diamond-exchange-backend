const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  
    sport_name: { type: String,  }, 
    min_bet: { type: String,  },
    max_bet: { type: String,  },
    status: { type: String,  },
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Vipcasino', schema);