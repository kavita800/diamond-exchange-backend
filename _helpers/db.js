const path = require('path'); 
path1 = path.resolve("config.json");
const config = require(path1);
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../models/user.model'),
    Userbet: require('../models/userbet.model') ,
    Fancybet: require('../models/fancybet.model'),
    Exposerlimit: require('../models/exposerlimit.model'),
    Creditamount: require('../models/creditamount.model'),
    Admintransaction: require('../models/admintransaction.model'),
    Matchdeclare: require('../models/matchdeclare.model'),
    Gametype: require('../models/gametype.model'),
    Hidematcheslist: require('../models/hidematcheslist.model'),
    Maximumbetlimit: require('../models/maximumbetlimit.model'),
    Suspend: require('../models/suspend.model'),
    Oods: require('../models/oods.model'),
    Matchresult: require('../models/matchresult.model'),
    Userbetsession: require('../models/userbetsession.model'),
    Buttonvalue: require('../models/buttonvalue.model'),
    Admintext: require('../models/admintext.model'),
    Browser: require('../models/browser.model'),
    Match: require('../models/match.model'),
    Adminurl: require('../models/adminurl.model'),
    Sport: require('../models/sport.model'),
    Matchdata: require('../models/matchdata.model'),
    Fancyresult: require('../models/fancyresult.model'),
    Fancylivedata: require('../models/fancylivedata.model'),
    Fancyhideshow: require('../models/fancyhideshow.model'),
    Betlock: require('../models/betlock.model'),
    Manualmatch: require('../models/manualmatch.model'),
    Matchlist: require('../models/matchlist.model'),
    Bookmakerlist: require('../models/bookmakerlist.model'),
    Userpermission: require('../models/userpermission.model'),
    Fancylist: require('../models/fancylist.model'),
    Sportcasino: require('../models/sportcasino.model'),
    Vipcasino: require('../models/vipcasino.model')


};