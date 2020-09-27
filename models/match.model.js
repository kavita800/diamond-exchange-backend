const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    cricket: { type: String,  }, 
    cricket_bookmaker: { type: String,  }, 
    type: { type: String,  }, 
    soccer: { type: String,  },
    soccer_bookmaker: { type: String,  },  
    tennis: { type: String, }, 
    tennis_bookmaker: { type: String,  },
    createdDate: { type: Date, default: Date.now } ,
    
    
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Match', schema);