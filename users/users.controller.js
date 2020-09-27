const express = require('express');
var request = require('request');
const router = express.Router();
const userService = require('./user.service');
const matchService = require('./match.service');
const userListService = require('./userlist.service');
const apiService = require('./api.service');
var jwttoken=require('../jwttoken');
const db = require('_helpers/db');
var axios = require('axios');
const User = db.User;


var ObjectId = require('mongoose').Types.ObjectId; 
// external api routes
router.get('/cricketmatchlist', cricketMatchList);
router.get('/sportoddslist', sportOddsList);

// routes
router.post('/authenticate', authenticate);
router.post('/register',jwttoken, register);
router.post('/userregister',jwttoken, userregister);
router.post('/createbetuser',jwttoken, createbetuser);
router.post('/addfancybet', addfancybet); 
router.post('/addnewmatch', addnewmatch); 
router.get('/fancybetlist',jwttoken, fancybetlist);
router.get('/fancybetlistFront',jwttoken, fancybetlistFront);
router.post('/emailverify', emailVerify);
router.post('/login', authenticate);
router.get('/admintotal',jwttoken, admintotal);
router.get('/usertotal',jwttoken, usertotal);
router.get('/adminlist',jwttoken, adminlist);
router.get('/userlist',jwttoken, userlist);
router.get('/userbet/:id',jwttoken, userlistdata);
router.get('/transactions',jwttoken, transactions);
router.get('/savematchresult/:marketid',jwttoken, saveMatchResult);
router.get('/result_rollback/:eventid',jwttoken, result_rollback);

router.get('/fancyapi/:matchid',jwttoken, fancyApi);
router.get('/checkmatchcomplete', checkMatchComplete);
router.get('/convertunmatchtomatch_cron', convertUnmatchToMatchCron);
router.get('/casinoresultteenpatti',jwttoken, casinoresultteenpati);
router.get('/casino_dt_one_day',jwttoken, casino_dt_one_day);
router.get('/andarbahar',jwttoken, andarbahar);


router.get('/worli2',jwttoken, worli2);


router.get('/update_qrcode/:id',jwttoken, update_qrcode);
router.get('/update_qrcode_data/:id',jwttoken, update_qrcode_data);
router.get('/user-logs/:id',jwttoken, userlogs);
router.get('/getfancylistbymatch/:match_id',jwttoken, getfancylistbymatch);
router.get('/cricket_data/:id',jwttoken, cricket_data);
router.get('/getbookmarketbymatchid/:match_id',jwttoken, getbookmarketbymatchid);
router.get('/updatematchlist', updatematchlist);
router.get('/bookmaker/:id',jwttoken, bookmaker);
router.get('/userbetlist_admin/:id',jwttoken, userbetlist_admin);
router.get('/userbetlistbook_admin/:id',jwttoken, userbetlistbook_admin);


router.get('/betlockdata',jwttoken, betlockdata);
router.get('/casiosportsdetails',jwttoken, casiosportsdetails);



router.get('/profit_loss',jwttoken, profit_loss);
router.post('/admin_profit_loss',jwttoken, admin_profit_loss);
router.post('/fancy_update',jwttoken, fancy_update);
router.get('/save_cricket_data', save_cricket_data);
router.get('/save_tennis_data', save_tennis_data);
router.get('/save_soccer_data', save_soccer_data);

router.post('/adduser_permission',jwttoken, adduser_permission);
router.post('/transactions',jwttoken, transactions_data);
router.post('/admin-transactions',jwttoken, admintransaction);
router.post('/user_transactions_cal',jwttoken, user_transactions_cal);
router.post('/fancy_result_rollback',jwttoken, fancy_result_rollback);


router.get('/userbetlist/:id',jwttoken, userbetlist);
router.get('/userbetlist_new',jwttoken, userbetlist_new);
router.post('/userbetlist_new',jwttoken, userbetlist_new_data);





router.get('/alluserbetlist',jwttoken, alluserbetlist);
router.get('/adminbetlist/:id',jwttoken, adminBetList);
router.get('/adminbetlist-user',jwttoken, adminbetlistuser);


router.post('/totalmatchlist', matchlist);
router.get('/matchlistdb', matchlistdb);
router.post('/matchdetails', matchdetails);

router.get('/', getAll);
router.get('/test', test);
router.get('/testurl', oodsRequest);
router.get('/current',jwttoken, getCurrent);
router.get('/gametypelist', gameTypeList);
router.get('/usermatchlist/:id',jwttoken, userMatchlist);
router.get('/usermatch_serieslist/:id',jwttoken, userMAtchSeries);
router.get('/betlock-history/:id/:id1',jwttoken, betlockhistory);


router.get('/adminmatchlist/:id',jwttoken, adminMatchlist);
router.get('/usermatchdetail/:id/:id1',jwttoken, userMatchDetail);

router.get('/usermatchdetail_test/:id/:id1',jwttoken, userMatchDetailTest);
router.get('/user_current_balance',jwttoken, userCurrentBalance);
router.get('/keepalive', keepalive);
router.get('/matchresult/:matchid', matchResult);
router.get('/users_trans_list/:id',jwttoken, users_trans_list); 
router.get('/logouts',jwttoken, logouts); 
router.get('/delete_bet_list/:id',jwttoken, delete_bet_list); 

router.get('/delete_all_bet_list', delete_all_bet_list); 
router.get('/check_match_complete', checkMatchComplete); 
router.get('/user_curr_balance',jwttoken, userCurrentBalanceWithExposure);
router.get('/maxbet_minbet/:id',jwttoken, maxbet_minbet);
router.get('/button_value',jwttoken, button_value);
router.get('/casino',jwttoken, casino);
router.get('/casino_teenpati_t20',jwttoken, casino_teenpati_t20);
router.get('/adminlistparent/:id',jwttoken, adminlistparent);
router.get('/current_user_data/:id',jwttoken, current_user_data);
router.get('/betlist-detils/:id/:id1',jwttoken, betlistdetils);


router.get('/get_admin_text_value',jwttoken, get_admin_text_value);
router.get('/qr_authenticator_on_off/:id/:id1',jwttoken, qr_authenticator_on_off);
router.get('/qr_authenticator_on_off_ststus/:id',jwttoken, qr_authenticator_on_off_ststus);
router.get('/fancy_result_admin/:id/:id1',jwttoken, fancy_result_admin);
router.get('/user-detils',jwttoken, userdetils);

router.get('/current-bets',jwttoken, currentBets);

router.get('/adminoddsresult',jwttoken,adminoddsresult);
router.get('/casino-result-dt20',jwttoken,casinoresultdt20);
router.get('/betlock-update/:id',jwttoken,betlockupdate);
router.get('/getuserpermission/:id',jwttoken,getuserpermission);
router.get('/userpermission',jwttoken,userpermission);
router.get('/casino-result/:id',jwttoken,casinoresultdetails);

router.get('/current_user_data/:id',jwttoken, current_user_data);
router.get('/sports-details',jwttoken, sports_details);
router.get('/current-sports',jwttoken, currentsports);
router.get('/manage_data/:id',jwttoken, manage_data);
router.get('/betlockuser/:id/:id1/:id2',jwttoken, betlockuser);
router.get('/permission_users_list',jwttoken, permission_users_list);
router.get('/casino-result',jwttoken, casinoresult);
router.get('/casino-result-unmatch-to-match', casinoresultunmatchtomatch);

router.get('/user-casino-deatils/:id',jwttoken, usercasinodeatils);
router.get('/casino_lucky_seven',jwttoken, casino_lucky_seven);
router.get('/teenpattit20',jwttoken, teenpattit20);
router.get('/worli2_result', worli2_result);

router.get('/card32_result', card32_result);
router.get('/lucky7b_result', lucky7b_result);
router.get('/getuserbetmatches',jwttoken, getuserbetmatches);

router.get('/getuserbetmatchesid/:id',jwttoken, getuserbetmatchesid);
router.get('/getuserbetmatches1/:id',jwttoken, getuserbetmatches1);
router.get('/getuserbetmatchesbookmaker/:id',jwttoken, getuserbetmatchesbookmaker);
router.get('/getuserbetmatchesfancy/:id',jwttoken, getuserbetmatchesfancy);
router.get('/vipcasiosportsdetails',jwttoken, vipcasiosportsdetails);


router.post('/getchildfancybetlist', jwttoken,getchildfancybetlist);
router.post('/getfancybetlist', jwttoken,getfancybetlist);
router.post('/updatebetstatus',jwttoken, updatebetstatus); 

router.post('/uniqueusername',jwttoken, uniqueusername);

router.get('/getgameassignuser/:id',jwttoken, getgameassignuser); 
router.get('/:id', getById);
router.put('/:id', update);
router.post('/gameassign', gameassign);
router.post('/profile', profile);
router.post('/addbookmaker', addbookmaker);
router.post('/update_user_permission', update_user_permission);
router.post('/update_user_amount',jwttoken, updateUserAmount);
router.post('/update_balance',jwttoken, updateBalance);
router.post('/change_user_password',jwttoken, changeUserPassword);
router.post('/change_bet_user_status',jwttoken, changeBetUserStatus);
router.post('/change_password',jwttoken, changePassword);
router.post('/change_password_user',jwttoken, changePasswordUser);
router.post('/admin_hide_match',jwttoken, adminHideMatch);
router.post('/update_unmatch_by_eventid',jwttoken, updateEventUnmatchStatus);
router.post('/maximum_bet_limit',jwttoken, maximumBetLimit);
router.post('/set_winner_by_admin', setWinnerByAdmin);
router.post('/set_fancy_result_by_admin', setFancyResultByAdmin);
router.post('/set_winner_by_result',jwttoken, setMatchWinnerByApi);
router.post('/suspend_data', SuspendData);
router.post('/partiuser_match_deatils/:id',jwttoken, partiuserMatchDetail);
router.post('/createbetusersession',jwttoken, createbetusersession);
router.post('/submit_button_value',jwttoken, submit_button_value);

router.post('/casinosportstatus',jwttoken, casinosportstatus);
router.post('/vipcasinosportstatus',jwttoken, vipcasinosportstatus);



router.post('/submit_admin_text_value',jwttoken, submit_admin_text_value);
router.post('/update_data/:id',jwttoken, update_data);
router.post('/change_password_admin',jwttoken, changePasswordAdmin);
router.post('/update_browser_details',jwttoken, update_browser_details);
router.post('/add_sports',jwttoken, add_sports);
router.post('/sport-status',jwttoken, sportstatus);
router.post('/match-update',jwttoken, matchupdate);
router.post('/fancy_result',jwttoken, fancy_result);
router.post('/bet-list-data',jwttoken, betlistdata);
router.post('/userbetdata',jwttoken, userbetdata);

router.post('/fancy_result_hide',jwttoken, fancy_result_hide);




router.delete('/:id', _delete);


// admin routes  
module.exports = router; 



function updateEventUnmatchStatus(req, res, next) {
	userListService.updateEventUnmatchStatus(req,res);
}

function fancy_update(req, res, next) {
	userService.fancy_update(req,res);
}

function fancy_update(req, res, next) {
	userService.fancy_update(req,res);
}

function getfancylistbymatch(req, res, next) {
	userService.getfancylistbymatch(req,res);
}

function fancy_result_rollback(req, res, next) {
	matchService.fancy_result_rollback(req,res);
}
function result_rollback(req, res, next) {
	matchService.result_rollback(req,res);
}
function getfancybetlist(req, res, next) {
	matchService.getfancybetlist(req,res);
}

function getchildfancybetlist(req, res, next) {
	matchService.getchildfancybetlist(req,res);
}

function update_user_permission(req, res, next) {
	matchService.update_user_permission(req,res);
}


function userpermission(req, res, next) {
	matchService.userpermission(req,res);
}
function getuserpermission(req, res, next) {
	matchService.getuserpermission(req,res);
}

function permission_users_list(req, res, next) {
	matchService.permissionUsersList(req,res);
}

function adduser_permission(req, res, next) {
	matchService.addUserPermission(req,res);
}

function getuserbetmatches(req, res, next) {
	matchService.getuserbetmatches(req,res);
}
function getuserbetmatchesid(req, res, next) {
	matchService.getuserbetmatchesid(req,res);
}

function cricketMatchList(req, res, next) {
	apiService.cricketMatchList(req,res);
}

function sportOddsList(req, res, next) {
	apiService.sportOddsList(req,res);
}

function getbookmarketbymatchid(req, res, next) {
	matchService.getBookmarketByMatchId(req,res);
}


function addbookmaker(req, res, next) {
	matchService.addbookmaker(req,res);
}

function updatematchlist(req, res, next) {
	matchService.updatematchlist(req,res);
}

function matchlistdb(req, res, next) {
	userService.matchlistdb(req,res);
}

function fancyApi(req, res, next) {
	matchService.fancyApi(req,res);
}

function saveMatchResult(req, res, next) {
	matchService.saveMatchResult(req,res);
}

function checkMatchComplete(req, res, next) {
	matchService.checkMatchComplete(req,res);
}

function convertUnmatchToMatchCron(req, res, next) {
	matchService.convertUnmatchToMatchCron(req,res);
}

function setFancyResultByAdmin(req, res, next) {
	matchService.setFancyResultByAdmin(req,res);
}
function setWinnerByAdmin(req, res, next) {
	matchService.setMatchWinnerByAdmin(req,res);
}
function setMatchWinnerByApi(req, res, next) {
	matchService.setMatchWinnerByApi(req,res);
}

function SuspendData(req, res, next) {
	matchService.SuspendData(req,res);
}
function casino(req, res, next,io) {
	matchService.casino(req,res,io);
}
// function casino(req, res, next) {
// 	matchService.casino(req,res);
// }
function casino_teenpati_t20(req, res, next) {
	matchService.casino_teenpati_t20(req,res);
}


function matchResult(req, res, next) {
	matchService.matchResult(req,res);
}

function adminHideMatch(req, res, next) {
	userService.adminHideMatch(req,res);
}

function keepalive(req, res, next) {
	userService.keepalive(req,res);
}

function submit_button_value(req, res, next) {
	userService.submit_button_value(req,res);
}
function userlogs(req, res, next) {
	userService.userlogs(req,res);
}



function userCurrentBalance(req, res, next) {
	userService.userCurrentBalance(req,res);
}
function gameTypeList(req, res, next) {
	userService.gametypelist(req,res);
}

function userMatchlist(req, res, next) {
	userService.userMatchlist(req,res);
}
function casinosportstatus(req, res, next) {
	userService.casinosportstatus(req,res);
}
function vipcasinosportstatus(req, res, next) {
	userService.vipcasinosportstatus(req,res);
}



function userMAtchSeries(req, res, next) {
	userService.userMAtchSeries(req,res);
}
function partiuserMatchDetail(req, res, next) {
	userService.partiuserMatchDetail(req,res);
}

function update_qrcode(req, res, next) {
	userService.update_qrcode(req,res);
}
function update_qrcode_data(req, res, next) {
	userService.update_qrcode_data(req,res);
}
function qr_authenticator_on_off(req, res, next) {
	userService.qr_authenticator_on_off(req,res);
}
function qr_authenticator_on_off_ststus(req, res, next) {
	userService.qr_authenticator_on_off_ststus(req,res);
}


function adminMatchlist(req, res, next) {
	userService.adminMatchlist(req,res);
}

function userMatchDetail(req, res, next) {
	userService.userMatchDetail(req,res);
}
function userMatchDetailTest(req, res, next) {
	userService.userMatchDetailTest(req,res);
}

function transactions(req, res, next) {
	userService.transactionsDetail(req,res);
}
function profit_loss(req, res, next) {
	userService.profit_loss(req,res);
}
function vipcasiosportsdetails(req, res, next) {
	userService.vipcasiosportsdetails(req,res);
}



function admin_profit_loss(req, res, next) {
	matchService.admin_profit_loss(req,res);
}

function transactions_data(req, res, next) {
	userService.transactions_data(req,res);
}
function admintransaction(req, res, next) {
	userService.admintransaction(req,res);
}




function updatebetstatus(req, res, next) {
	userService.updatebetstatus(req,res);
}

function delete_bet_list(req, res, next) {
	userService.delete_bet_list(req,res);
}
function delete_all_bet_list(req, res, next) {
	userService.delete_all_bet_list(req,res);
}


async function test(req, res, next) {
	var userId = '5f1ac2932e472729c02e645a';
	var profitLossAmt = 8;
	await User.updateOne({_id: new ObjectId(userId)}, {  $inc:{ profit_loss: profitLossAmt }}, {upsert: true},function(err,resu){
					if(err){
						console.log('errr');
						console.log(err);
					}
					
				});
	res.json({"success":true,"message":"Match Hide Successfully"})			
/* var axios = require('axios');

var config = {
  method: 'get',
  url: 'http://rohitash.dream24.bet:3000/getmarket?id=1.171575821,1.171576438',
  headers: { }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
 */

	
	
	
} 
function changeUserPassword(req, res, next) {
    userService.changeUserPassword(req,res);
}
function users_trans_list(req, res, next) {
    userService.usersTransListData(req,res);
}
function logouts(req, res, next) {
    userService.logouts(req,res);
}

function changePassword(req, res, next) {
    userService.changePassword(req,res);
}
function changePasswordUser(req, res, next) {
    userService.changePasswordUser(req,res);
}
function changePasswordAdmin(req, res, next) {
    userService.changePasswordAdmin(req,res);
}




function changeBetUserStatus(req, res, next) {
    userService.changeBetUserStatus(req,res);
}

function admintotal(req, res, next) {
    userService.admintotal(req,res);
} 
function adminBetList(req, res, next) {
    userService.adminBetList(req,res);
} 
function usertotal(req, res, next) {
    userService.usertotal(req,res);
} 
function adminlist(req, res, next) {
    userService.adminlist(req,res);
}  

function adminlistparent(req, res, next) {
    userService.adminlistparent(req,res);
}  


function fancybetlist(req, res, next) {
    userService.fancybetlist(req,res);
}
function fancybetlistFront(req, res, next) {
    userService.fancybetlistFront(req,res);
}  
function userlist(req, res, next) {
    userService.userlist(req,res);
} 
function userlistdata(req, res, next) {
    userService.userbetListData(req,res);
}
function userCurrentBalanceWithExposure(req, res, next) {
    userService.userCurrentBalanceWithExposure(req,res);
}


function userbetlist(req, res, next) {
    userService.userbetlist(req,res);
} 

function userbetlist_new(req, res, next) {
    userService.userbetlist_new(req,res);
} 
function userbetlist_new_data(req, res, next) {
    userService.userbetlist_new_data(req,res);
} 

function alluserbetlist(req, res, next) {
    userService.alluserbetlist(req,res);
} 
function authenticate(req, res, next) {
   
    userService.authenticate(req.body,req.session.id)
.then(user =>  

    user !== undefined ? res.json({"success":true,"message":user,"session_id":req.session.id}) : res.json({"success":false, message: 'Username or password is incorrect' })
        
    )
           
        .catch(err => res.json({"success":false, message: 'Username or password is incorrect' }));
    } 

function register(req, res, next) {
   
	userService.create(req,res);	
    /* userService.create(req,req.body)
        .then(() => res.json({"success":true,"message":"Registered Successfully"}))
        .catch(err => res.json({"success":false,"message":err})); */
        //.catch(err => next(err));
}

function userregister(req, res, next) { 
    userService.createuser(req,req.body)
        .then(() => res.json({"success":true,"message":"Registered Successfully"}))
        .catch(err => res.json({"success":false,"message":err})); 
        //.catch(err => next(err));
}
function createbetuser(req, res, next) {  
    userService.createbetuser(req, res);
        //.catch(err => next(err));
}
function createbetusersession(req, res, next) {  
    userService.createbetusersession(req, res);
        //.catch(err => next(err));
}

function addfancybet(req, res, next) {  
    userService.addfancybet(req.body)
        .then(() => res.json({"success":true,"message":"Fancy Bat Add Successfully","result":req.body}))
        .catch(err => res.json({"success":false,"message":err}));
        //.catch(err => next(err));
}

function addnewmatch(req, res, next) {  
    userService.addnewmatch(req, res);
        //.catch(err => next(err));
}

function emailVerify(req, res, next) {
	
    userService.userEmailVerify(req.body)
        .then(() => res.json({"success":true,"message":"User Verified Successfully"}))
        .catch(err => res.json({"success":false,"message":err}));
        //.catch(err => next(err));
}



function getAll(req, res, next) {
	res.json({ success: true, message: 'Good Bye' }) 
   /*  userService.getAll(req, res)
        .then(users => res.json(users))
        .catch(err => next(err)); */
}

function getCurrent(req, res, next) {
    
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}
function getgameassignuser(req, res, next) {
    userService.userlist(req,res);
}

function gameassign(req, res, next) {
    userService.gameassign(req.params.id, req.body,res) ;
}
function profile(req, res, next) {
    userService.profile(req.params.id, req.body,res) ;
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function updateUserAmount(req, res, next) {
     userService.updateUserAmount(req,res);
}

function updateBalance(req, res, next) {
     userService.updateBalance(req,res);
}
function gameassign(req, res, next) {
    userService.gameassign(req.params.id, req.body,res) ;
}
function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
} 
function matchlist(req, res, next){  
    var options = { method: 'GET',
    url: 'http://185.16.206.13:8080/api/listBetMarkets/'+req.body.id+'/true',
      };

  request(options, function (error, response, body) {
    if (error){
        res.json({"success":false,"message":error,data:body});
    }
    else {
      res.json({"success":true,"message":"Matches List",data:body});
    }
  });
}

function maxbet_minbet(req, res, next) {
	userService.maxbet_minbet(req,res);
}
function button_value(req, res, next) {
	userService.button_value(req,res);
}



function maximumBetLimit(req, res, next) {
	userService.maximumBetLimit(req,res);
}
function submit_admin_text_value(req, res, next) {
	userService.submit_admin_text_value(req,res);
}
function get_admin_text_value(req, res, next) {
	userService.get_admin_text_value(req,res);
}


function update_data(req, res, next) {
	userService.update_data(req,res);
}
function update_browser_details(req, res, next) {
	userService.update_browser_details(req,res);
}
function save_cricket_data(req, res, next) {
	userService.save_cricket_data(req,res);
}
function cricket_data(req, res, next) {
	userService.cricket_data(req,res);
}
function save_tennis_data(req, res, next) {
	userService.save_tennis_data(req,res);
}
function save_soccer_data(req, res, next) {
	userService.save_soccer_data(req,res);
}
function bookmaker(req, res, next) {
	userService.bookmaker(req,res);
}
function userbetdata(req, res, next) {
	userService.userbetdata(req,res);
}
function userbetlist_admin(req, res, next) {
	matchService.userbetlistadmin(req,res);
}
function userbetlistbook_admin(req, res, next) {
	matchService.userbetlistbook_admin(req,res);
}


function current_user_data(req, res, next) {
	userListService.current_user_data(req,res);
}
function add_sports(req, res, next) {
	userService.add_sports(req,res);
}
function sports_details(req, res, next) {
	userService.sports_details(req,res);
}
function casiosportsdetails(req, res, next) {
	userService.casiosportsdetails(req,res);
}

function sportstatus(req, res, next) {
	userService.sportstatus(req,res);
}
function currentsports(req, res, next) {
	userService.currentsports(req,res);
}
function matchupdate(req, res, next) {
	userService.matchupdate(req,res);
}

function manage_data(req, res, next) {
	userService.manage_data(req,res);
}
function fancy_result(req, res, next) {
	userService.fancy_result(req,res);
}
function fancy_result_admin(req, res, next) {
	userService.fancy_result_admin(req,res);
}
function userdetils(req, res, next) {
	userService.userdetils(req,res);
}
function adminbetlistuser(req, res, next) {
	userService.adminbetlistuser(req,res);
}
function betlistdata(req, res, next) {
	userService.betlistdata(req,res);
}
function currentBets(req, res, next) {
	userService.currentBets(req,res);
}
function adminoddsresult(req, res, next) {
	userService.adminoddsresult(req,res);
}
function uniqueusername(req, res, next) {
	userService.uniqueusername(req,res);
}
function fancy_result_hide(req, res, next) {
	userService.fancy_result_hide(req,res);
}
function casinoresultdt20(req, res, next) {
	matchService.casinoresultdt20(req,res);
}

function betlistdetils(req, res, next) {
	userService.betlistdetils(req,res);
}
function betlockuser(req, res, next) {
	userService.betlockuser(req,res);
}
function betlockhistory(req, res, next) {
	userService.betlockhistory(req,res);
}
function betlockupdate(req, res, next) {
	userService.betlockupdate(req,res);
}
function betlockdata(req, res, next) {
	userService.betlockdata(req,res);
}

function oodsRequest(req, res, next) {
	userService.oodsRequest(req,res);
}

function casinoresult(req, res, next) {
	userService.casinoresult(req,res);
}


function casinoresultunmatchtomatch(req, res, next) {
	matchService.casinoresultunmatchtomatch(req,res);
}
function casinoresultteenpati(req, res) {
	matchService.casinoresultteenpati(req,res);
}

function casino_dt_one_day(req, res) {
	matchService.casino_dt_one_day(req,res);
}
function usercasinodeatils(req, res) {
	matchService.usercasinodeatils(req,res);
}
function casino_lucky_seven(req, res) {
	userService.casino_lucky_seven(req,res);
}
function teenpattit20(req, res) {
	userService.teenpattit20(req,res);
}
function andarbahar(req, res) {
	userService.andarbahar(req,res);
}

function worli2(req, res) {
	userService.worli2(req,res);
}
function worli2_result(req, res) {
	matchService.worli2_result(req,res);
}
function card32_result(req, res) {
	matchService.card32_result(req,res);
}

function lucky7b_result(req, res) {
	matchService.lucky7b_result(req,res);
}




function card32a_data(req, res) {
	userService.card32a_data(req,res);
}
function user_transactions_cal(req, res) {
	userService.user_transactions_cal(req,res);
}
function casinoresultdetails(req, res) {
	userService.casinoresultdetails(req,res);
}
function getuserbetmatches1(req, res) {
	matchService.getuserbetmatches1(req,res);
}
function getuserbetmatchesbookmaker(req, res) {
	matchService.getuserbetmatchesbookmaker(req,res);
}
function getuserbetmatchesfancy(req, res) {
	matchService.getuserbetmatchesfancy(req,res);
}


function matchdetails(req, res, next){ 
    var options = { method: 'GET',
    url: 'http://185.16.206.13:8080/api/betMarket/'+req.body.id,
    headers: 
     { 'postman-token': '35206393-143f-165f-0141-6772057b08b6',
       'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error){
        res.json({"success":false,"message":error,data:""});
    }
    else {
      res.json({"success":true,"message":"Matches Detail",data:body});
    }
  });
}
