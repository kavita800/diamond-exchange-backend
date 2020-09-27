const config = require('config.json');
const jwt = require('jsonwebtoken');
var request = require('request');
const bcrypt = require('bcryptjs');
const md5 = require('md5');
const db = require('_helpers/db');
var axios = require('axios');
const https = require('https');

const User = db.User;
const Userbet = db.Userbet;
const Fancybet = db.Fancybet; 
const Exposerlimit = db.Exposerlimit; 
const Creditamount = db.Creditamount; 
const Admintransaction = db.Admintransaction; 
const Gametype = db.Gametype; 
const Maximumbetlimit = db.Maximumbetlimit; 
const Hidematcheslist = db.Hidematcheslist; 
const Userbetsession = db.Userbetsession; 
const Oods = db.Oods; 
const Buttonvalue = db.Buttonvalue; 
const Admintext = db.Admintext; 
const Browser = db.Browser; 
const Match = db.Match; 
const Sport = db.Sport; 
const Sportcasino = db.Sportcasino; 
const Matchdata = db.Matchdata; 
const Fancyresult = db.Fancyresult; 
const Suspend = db.Suspend; 
const Matchdeclare = db.Matchdeclare; 
const Fancyhideshow = db.Fancyhideshow; 
const Betlock = db.Betlock; 
const Manualmatch = db.Manualmatch; 
const Matchlist = db.Matchlist; 
const Bookmakerlist = db.Bookmakerlist; 
const Fancylist = db.Fancylist; 
const Vipcasino = db.Vipcasino; 



const getFixture = require('getfixture.json');
var ObjectId = require('mongoose').Types.ObjectId; 

//const baseUrl = "http://139.162.197.173:4444/api/v1/exchange";
//const baseUrl = "http://139.162.197.173:4444/api/v1/exchange";
const baseUrl = "https://api.betfair.com/exchange/betting/json-rpc/v1";
const apiUsername = "info@technoloader.com";
const apiPassword = "v4f6d3swds";
const apiGuid = "e8afaf2d-9b33-4337-8277-de57cda3401d";

const betFairApiKey = "l1hG9dY3QYIABzet";
const betFairSessonToken = "oWNgN3N6onda6HBnmT7/t79NtCEKZBAS09DKeX33wwo=";
module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    userEmailVerify,
    delete: _delete,
    admintotal,
    adminlist,
    userlist,
    createuser,
    gameassign,
    usertotal,
    getgameassignuser,
    profile,
	createbetuser,
	createbetusersession,
	userbetlist,
    alluserbetlist,
    addfancybet,
    addnewmatch,
    fancybetlist,
    fancybetlistFront,
	updateUserAmount,
	updateBalance,
	changeUserPassword,
	gametypelist,
	userMatchlist,
	userMatchDetail,
	userMatchDetailTest,
	changeBetUserStatus,
	changePassword,
	changePasswordUser,
	userCurrentBalance,
	adminMatchlist,
	adminBetList,
	adminbetlistuser,
	keepalive,
	adminHideMatch,
	userbetListData,
	matchResult,
	usersTransListData,
	transactionsDetail,
	transactions_data,
	maximumBetLimit,
	logouts,
	updateSession,
	userbetlist_new,
	userbetlist_new_data,
	delete_bet_list,
	delete_all_bet_list,
	profit_loss,
	userCurrentBalanceWithExposure,
	maxbet_minbet,
	userMAtchSeries,
	partiuserMatchDetail,
	submit_button_value,
	button_value,
	submit_admin_text_value,
	get_admin_text_value,
	adminlistparent,
	current_user_data,
	update_data,
	changePasswordAdmin,
	update_qrcode,
	update_qrcode_data,
	qr_authenticator_on_off,
	qr_authenticator_on_off_ststus,
	update_browser_details,
	userlogs,
	save_cricket_data,
	save_tennis_data,
	cricket_data,
	save_soccer_data,
	bookmaker,
	userbetdata,
	add_sports,
	sports_details,
	sportstatus,
	currentsports,
	matchupdate,
	manage_data,
	fancy_result,
	fancy_result_admin,
	userdetils,
	betlistdata,
	currentBets,
	adminoddsresult,
	uniqueusername,
	fancy_result_hide,
	betlistdetils,
	betlockuser,
	betlockhistory,
	betlockupdate,
	betlockdata,
	oodsRequest,
	casinoresult,
	matchlistdb,
	casino_lucky_seven,
	teenpattit20,
	andarbahar,
	worli2,
	user_transactions_cal,
	casinoresultdetails,
	getfancylistbymatch,
	fancy_update,
	updatebetstatus,
	casiosportsdetails,
	casinosportstatus,
	vipcasiosportsdetails,
	vipcasinosportstatus
};

async function fancy_update(req,res) {
		var fancyId = req.body.fancy_id;
		var operationType = req.body.operation_type;
		var operationValue = req.body.operation_value;
		if(operationType=="activate") {
			await Fancylist.updateOne({_id: new ObjectId(fancyId)}, {$set: { is_active: operationValue }}, {upsert: true},function(err,resu){ });
		}
		else {
			await Fancylist.updateOne({_id: new ObjectId(fancyId)}, {$set: { is_suspended: operationValue }}, {upsert: true},function(err,resu){ });
		}
		res.json({"success":false,"message":"data udated successfully"})
	}
async	function getfancylistbymatch(req,res) {
		var eventId = req.params.match_id;
		var findFancy = await Fancylist.find({event_id:eventId});
		if(findFancy.length==0){
			var getMatchdetails = await Manualmatch.findOne({match_id:eventId});
			if(getMatchdetails!=null) {
				
				await saveFancyToDb(eventId,getMatchdetails.sport_type,getMatchdetails.match_name)
			}
		}
		var resp =await Fancylist.find({event_id:eventId});
			if(resp==null){
				
				res.json({"success":false,"message":"No Fancy Found"});
			}
			else {
				
				res.json({"success":true,"message":"Fancy list","data":resp})
			}
		
	}
	
	
	function matchlistdb(req,res) {
		Matchlist.find({result_declare: "yes"},function(err,resp){
			if(resp==null){
				res.json({"success":false,"message":"No Match Found"})
			}
			else {
				
				res.json({"success":true,"message":"Match list","showdata":resp})
			}
		})
	}

 function matchResult(req,res) {
	var userParam = req.body;
	var winSelectionId = 10301;
	var looseSelectionId = 152530;
	var matchid = req.params.matchid;
    Userbet.find({selection_id:winSelectionId,type:'match',status:'pending'},function (e, result) { 
       
			if(result.length!=0){
				var transArr = [];
				var profitLossAmt  = 0;
				for(i=0;i<result.length;i++){
					var singleRecord = result[i];
					var betType = singleRecord.bet_type;
					var userbet_id = singleRecord._id;
					var profitLossAmt = singleRecord.profit;
					var userId = singleRecord.user_id;
					
					var newTransobj = {};
					newTransobj.user_id = new Object(userId);
					newTransobj.userbet_id = new Object(userbet_id);
					newTransobj.amount = profitLossAmt;
					newTransobj.trans_type = 'deposit';
					newTransobj.remark = 'profit';
					transArr.push(newTransobj);
					singleRecord.status='completed';
					Userbet.updateOne({_id: new ObjectId(userbet_id)}, {$set: { status: 'completed' }}, {upsert: true},function(err,resu){
						
					});
					
					User.updateOne({_id: new ObjectId(userId)}, { $inc:{ profit_loss:  profitLossAmt }}, {upsert: true},function(err,resu){
						if(err){
							//////////////console.log(err);
						}
					});
				}

				Admintransaction.insertMany(newTransobj,function(err,resu){
					
				});
				
				
				
			}
		 
    }) ; 
	
	Userbet.deleteMany({selection_id:winSelectionId,type:'unmatch',status:'pending'},function(err,resu){});
	Userbet.deleteMany({selection_id:looseSelectionId,type:'unmatch',status:'pending'},function(err,resu){});

	Userbet.find({selection_id:looseSelectionId,type:'match',status:'pending'},function (e, result) { 
       
			if(result.length!=0){
				var transArr = [];
				var profitLossAmt  = 0;
				for(i=0;i<result.length;i++){
					var singleRecord = result[i];
					var betType = singleRecord.bet_type;
					var userbet_id = singleRecord._id;
					var userId = singleRecord.user_id;
					if(betType=="back"){
						 profitLossAmt = singleRecord.stake;
					}
					else if(betType=="lay"){
						 profitLossAmt = (singleRecord.odds -1)*singleRecord.stake;
					}
					var newTransobj = {};
					newTransobj.user_id = new Object(userId);
					newTransobj.userbet_id = new Object(userbet_id);
					newTransobj.amount = -profitLossAmt;
					newTransobj.trans_type = 'withdrawal';
					newTransobj.remark = 'loss';
					transArr.push(newTransobj);
					Userbet.updateOne({_id: new ObjectId(userbet_id)},{$set: { status: 'completed'}}, {upsert: true},function(err,resu){});
					User.updateOne({_id: new ObjectId(userId)}, { $inc:{ profit_loss:  -profitLossAmt }}, {upsert: true},function(err,resu){
						if(err){
							//////////////console.log(err);
						}
					});
				}
				
				Admintransaction.insertMany(newTransobj,function(err,resu){
					
				})
			}
	 
    }) ;
	res.json({"success":true,"message":"Match Hide Successfully"})
}

async function adminHideMatch(req,res) {
	var userParam = req.body;
	if(userParam.event_action=="inactive"){
		const hidematcheslist = new Hidematcheslist({event_id:userParam.event_id,event_name:userParam.event_name});

		if(await hidematcheslist.save()){

			res.json({"success":true,"message":"Match Hide Successfully"})
		}
		else {
			res.json({"success":false,"message":"Unable to hide match"})
		}
	}
	else if(userParam.event_action=="active"){
		await Hidematcheslist.deleteOne({ event_id: userParam.event_id }, function (err) {
		  if (err) {
			 res.json({"success":false,"message":"Unable to show match"}) 
		  }
		  else {
			  res.json({"success":true,"message":"Match Show Successfully"})
		  }
		  // deleted at most one tank document
		});
	}
	else {
		res.json({"success":false,"message":"Unable to hide match"})
	}
}

async function keepalive(req,res){
	
	
		var axios = require('axios');

		var config = {
		  method: 'get',
		  url: 'https://identitysso.betfair.com/api/keepAlive',
		  headers: { 
			'Accept': 'application/json', 
			'X-Application': betFairApiKey, 
			'X-Authentication': betFairSessonToken
		  }
		};

		var userData = await axios(config)
		.then(function (response) {
		 return JSON.stringify(response.data);
		})
		.catch(function (error) {
		 // ////////////console.log(error);
		});

		res.json({ success: true, message: 'resp List',data:userData });
		
	
}
async function gametypelist(req,res){
	

	await Gametype.find({game_status:'Y'},function (e, result) { 
		if (e) {
			res.json({ success: false, message: 'No Data found' })
		} else {
			res.json({ success: true, message: 'Admin Total', showdata: result });
		}

	}) ; 
	
}

async function adminBetList(req,res){
	
	var currentUserId = req.user.sub;
	var userId = req.params.id;
	const user = await User.findById(userId);  
    if (!user) {
		res.json({ success: false, message: 'User Not Found'});
	}
	else {
		await Userbet.find({user_id:new ObjectId(userId)},function (e, result) { 
			if (e) {
				res.json({ success: false, message: 'No Data found' })
			} else {
				res.json({ success: true, message: 'bet list', showdata: result });
			}

		}) ; 
	}
	
}
async function adminbetlistuser(req,res){
	
	var currentUserId = req.body.sub;
	var userId = req.params.id;
	var user = await User.find({ "parentid": req.user.sub });  
	
	 if (!user) {
		res.json({ success: false, message: 'User Not Found'});
	}
	else {
		
		var arr=[];
		var arr2=[];
		var arr3=[];
		for(i=0;i<user.length;i++){
			var data=await Userbet.find({user_id:new ObjectId(user[i]._id)},function (e, result) {}).populate('user_id') ; 
			if(data!='' && data!=null && data!=undefined){
				
				for(j=0;j<data.length;j++){
					var a = arr.includes(data[j].event_id);
					arr.push(data[j].event_id);
					
					//console.log(a);
					if(a==0){
						arr2.push(data[j].event_id);
					}
				}
				

			}
		}	
		

		for(var c=0;c<arr2.length;c++){
			console.log(arr2[c]);
			var data=await Userbet.find({event_id:arr2[c]},function (e, result) {}).populate('user_id') ; 
			if(data!='' && data!=null && data!=undefined){
				arr3.push(data);
			}
		}
		
	res.json({ success: true, message: 'Sucess',data:arr3 })
		
	}
	
}

async function betlistdata(req,res){

    var currentUserId = req.body.sub;
    var userId = req.params.id;
    var user = await User.find({ "parentid": req.user.sub });



    if (!user) {
        res.json({ success: false, message: 'User Not Found'});
    }
    else {
        var arr=[];
        for(i=0;i<user.length;i++){
        var data=await Userbet.find({user_id:user[i]._id,type:req.body.match_type},function (e, result) {}).populate('user_id') ; 
        if(data!='' && data!=null && data!=undefined){
            arr.push(data);
        }


    }
    res.json({ success: true, message: 'Sucess',data:arr })

    }

}


async function userbetListData(req,res){
	
	var userId = req.params.id;
	var getTotalStackBalance ='';
	const user = await User.findById(userId);  
    if (!user) {
		res.json({ success: false, message: 'User Not Found'});
	}
	else {

		var getTotalStake =  await Userbet.aggregate([
			{ $match: { user_id : new ObjectId(userId),status: 'pending' } },
			{
			  $group : {
				_id : null,
				 staketotal: { $sum: "$stake"}
			  }
			}
		  ]);




		  


		  if(getTotalStake.length!=0){
			getTotalStackBalance = getTotalStake[0].staketotal	;
		} 
		
		
		var availableBalance ='';
		res.json({ success: true, message: 'Balance',data:{availableBalance:getTotalStackBalance} });


		
	}
	
}

async function userMatchlist(req,res){
		
// 		const hmlist = await Hidematcheslist.find({});
// 		var myArr = [];
// 		var myArr2 = [];
// 		var myArr1 = [];

		
// 		var sportId = req.params.id;
// 		var axios = require('axios');

// var config = {
//   method: 'get',
//   url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sportId,
//   headers: { 
//     'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
//   },
//   httpsAgent: new https.Agent({
// 	rejectUnauthorized: false
//   })
// };

// axios(config)
// .then(async function (response) {
	
// 	if(response.data.code!='400'){

	
//   var newdata=response.data.data.result;
 
  
//    for(var i=0;i<newdata.length;i++){
	
// 	var config = {
// 		method: 'get',
// 		url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sportId+'&series_id='+newdata[i].series_id,
// 		headers: { 
// 		  'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
// 		},
// 		httpsAgent: new https.Agent({
// 		  rejectUnauthorized: false
// 		})
// 	  };
	  
// 	  var matchDataArr = await axios(config)
// 	  .then(function (response1) {
// 		return response1.data.data.result;

// 		//////////////console.log(newdata2);
		
// 	  })
	 
// 	//  for(var index=0;index<matchDataArr.length;index++){
// 	// 		 //////console.log(matchDataArr[length]);
// 	// 		 return false;
// 	//  }
	 
// 	  myArr.push(matchDataArr);
	  

//   }
  
// //   for (var a = 0; a < myArr.length; a++) {
// // 	for (var b = 0; b < myArr[a].length;b++) {
  
			
// // 			 var config = {
// // 				method: 'get',
// // 				url: 'https://bet247exch.com/bookmaker?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&match_id='+myArr[a][b].match_id,
// // 				headers: { 
// // 				  'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
// // 				},
// // 				httpsAgent: new https.Agent({
// // 				  rejectUnauthorized: false
// // 				})
// // 			  };
			  
// // 			  var matchDataArr1 = await axios(config)
// // 			  .then(function (response1) {
// // 				return response1.data.data.result;
		
// // 				//////////////console.log(newdata2);
				
// // 			  })
// // 			  	if(matchDataArr1!=''){
// // 					myArr1.push([matchDataArr1]);
			  
// // 				  }else{
// // 					myArr1.push(["1"]);
// // 				  }
				
			  
			 
// // 	 }
// // 	}
	
// }
	

//   if(myArr.length==0){
// 	res.json({ success: false, message: 'No Data found',data:myArr,data1:myArr1 });
// }
// else {
// 	res.json({ success: true, message: 'Match List',data:myArr,data1:myArr1 });
// } 
// })
// .catch(function (error) {
// ////////console.log(error);
// });










		// var data = JSON.stringify([{"jsonrpc":"2.0","method":"SportsAPING/v1.0/listEvents","params":{"filter":{"eventTypeIds":[sportId]}},"id":1}]);	
			
			
		// var config = {
		//   method: 'post',
		//   url: baseUrl,
		//   headers: { 
		// 	'X-Application': betFairApiKey, 
		// 	'X-Authentication': betFairSessonToken, 
		// 	'Accept': 'application/json', 
		// 	'Content-Type': 'application/json'
		//   },
		//   data : data
		// };	
		// var matchDataArr = await axios(config)
		// 					.then(function (response) {
		// 					  return response.data;
		// 					})
		// 					.catch(function (error) {
		// 					  //////////////console.log(error);
		// 					});;	
		
		// res.json({ success: true, message: 'Match List',data:{matchlist : matchDataArr[0].result,inactive_matches:myArr} });
		// /* var config = {
		//   method: 'get',
		//   url: baseUrl+'/series/'+sportId,
		//   headers: { }
		// };

		// let mydata = await axios(config)
		// .then(function (response) {
		//   return response.data;
		// })
		// .catch(function (error) {
		//   ////////////console.log(error);
		// });
		// var matchDataArr= [];
		// for(var i=0;i<mydata.length;i++){
		// 	var singleData = mydata[i];
		// 	if(singleData.marketCount>1){
		// 		var seriesId = singleData.competition.id;
		// 		let getMatchData = await axios({method: 'get',url: baseUrl+'/match/'+sportId+'/'+seriesId})
		// 		.then(function (response) {
		// 		  return response.data;
		// 		})
		// 		.catch(function (error) {
		// 		  ////////////console.log(error);
		// 		});
		// 		matchDataArr.push(getMatchData);
				
		// 	}
		// }
	
		// if(matchDataArr.length==0){
		// 	res.json({ success: false, message: 'No Data found',data:matchDataArr });
		// }
		// else {
		// 	res.json({ success: true, message: 'Match List',data:matchDataArr });
		// } */
	
}

async function adminMatchlist(req,res){
	
		
		 var disableUnmatchBetEventList = []
		const getManualMatchData = await Manualmatch.find({unmatch_bet:'disable'});
		if(getManualMatchData!=null && getManualMatchData.length>0){
			for(i=0;i < getManualMatchData.length;i++){
				var getValUnmatch = getManualMatchData[i];
				
	
				disableUnmatchBetEventList.push(getValUnmatch.match_id);
			
			}
		}
		
		var resultDeclareMatchList = []
		const gesultDeclareMatchData = await Manualmatch.find({result_declare:'yes'});
		if(gesultDeclareMatchData!=null && gesultDeclareMatchData.length>0){
			for(i=0;i < gesultDeclareMatchData.length;i++){
				var getValUnmatch = gesultDeclareMatchData[i];
				
	
				resultDeclareMatchList.push(getValUnmatch.match_id);
			
			}
		}
		
		 const hmlist = await Hidematcheslist.find({});
		 const Suspendlist = await Suspend.find({status:1});
		var myArr1 = [];
		var myArr2 = [];
		if(hmlist!=undefined){
			for(i=0;i < hmlist.length;i++){
				var getVal = hmlist[i];
				
	
				myArr1.push(getVal.event_id);
			
			}
		}
		if(Suspendlist!=undefined){
			for(j=0;j < Suspendlist.length;j++){
				var getVal1= Suspendlist[j];
				
	
				
				myArr2.push(getVal1.event_id);
			}
		}
		
		
		//var myArr = [];
		var sportId = req.params.id;
		//////////////console.log(sportId);

	var myArr=await Match.findOne({ type:req.params.id,type:req.params.id });
  
  
  if(myArr.length==0){
	res.json({ success: false, message: 'No Data found',data:myArr ,inactive_matches:myArr1,suspend_match:myArr2,disableUnmatchBetEventList:disableUnmatchBetEventList,resultDeclareMatchList:resultDeclareMatchList});
}
else {
	res.json({ success: true, message: 'Match List',data:myArr,inactive_matches:myArr1,suspend_match :myArr2,disableUnmatchBetEventList:disableUnmatchBetEventList,resultDeclareMatchList:resultDeclareMatchList});
} 

		// var sportId = req.params.id;		 
		// var data = JSON.stringify([{"jsonrpc":"2.0","method":"SportsAPING/v1.0/listEvents","params":{"filter":{"eventTypeIds":[sportId]}},"id":1}]);	
			
			
		// var config = {
		//   method: 'post',
		//   url: baseUrl,
		//   headers: { 
		// 	'X-Application': betFairApiKey, 
		// 	'X-Authentication': betFairSessonToken, 
		// 	'Accept': 'application/json', 
		// 	'Content-Type': 'application/json'
		//   },
		//   data : data
		// };	
		// var matchDataArr = await axios(config)
		// 					.then(function (response) {
		// 					  return response.data;
		// 					})
		// 					.catch(function (error) {
		// 					 // ////////////console.log(error);
		// 					});	
		
		//res.json({ success: true, message: 'Match List',data:{allmatches : matchDataArr[0].result,inactive_matches:myArr} });
	
}

async function userMAtchSeries(req,res){
		
// 	const hmlist = await Hidematcheslist.find({});
// 	var myArr = [];
// 	var sportId = req.params.id;
// 	//////////////console.log(sportId);

// 	var axios = require('axios');

// var config = {
// method: 'get',
// url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sportId,
// headers: { 
// 'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
// },
// httpsAgent: new https.Agent({
// rejectUnauthorized: false
// })
// };

// axios(config)
// .then(async function (response) {
// var newdata=response.data.data.result;

// if(newdata.length==0){
// res.json({ success: false, message: 'No Data found',data:newdata });
// }
// else {
// res.json({ success: true, message: 'Match List',data:newdata });
// } 
// })
// .catch(function (error) {
// //////////////console.log(error);
// });


}
async function partiuserMatchDetail(req,res){
		
// 	const hmlist = await Hidematcheslist.find({});
// 	var myArr = [];

// 	//////////////console.log(sportId);

// 	var axios = require('axios');

// var new_value= req.body.event_id;



// var newvalue1=new_value.split(",");
// // for(var index=0;index<newvalue1.length;index++){
// // 	//////////console.log(newvalue1[index])
// // }



//    for(var index=0;index<newvalue1.length;index++){
	   
	
// 	var config = {
// 		method: 'get',
// 		url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+req.params.id+'&series_id='+newvalue1[index],
// 		headers: { 
// 		  'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
// 		},
// 		httpsAgent: new https.Agent({
// 		  rejectUnauthorized: false
// 		})
// 	  };
	  
// 	  var matchDataArr = await axios(config)
// 	  .then(function (response1) {
// 		return response1.data.data.result;
		
// 		//////////////console.log(newdata2);
		
// 	  })
// 	  myArr.push(matchDataArr);
	  

//   }
  
//   if(myArr.length==0){
// 	res.json({ success: false, message: 'No Data found',data:myArr });
// }
// else {
// 	res.json({ success: true, message: 'Match List',data:myArr });
// } 


















}


async function saveMatchToDb(matchJsonData){
	//var convertToObj = JSON.parse(matchJsonData)[0];
	//console.log(matchJsonData);
	
	matchJsonData = matchJsonData[0];
	var sport_type="";
	if(matchJsonData.sport_id=='1'){
		sport_type="soccer";
	}
	else if(matchJsonData.sport_id=='2'){
		sport_type="tennis";
	}
	else if(matchJsonData.sport_id=='4'){
		sport_type="cricket";
	}
	var teamsData = JSON.parse(matchJsonData.teams);
	var firstRunner = teamsData.runners[0];
	var secondRunner = teamsData.runners[1];
	
	var newSaveObj = {    
		match_id: matchJsonData.match_id, 
		market_id: matchJsonData.market_id, 
		match_name: matchJsonData.match_name, 
		open_date: matchJsonData.open_date, 
		series_id:  matchJsonData.series_id,  
		series_name: matchJsonData.series_name, 
		sport_id: matchJsonData.sport_id,
		sport_type: sport_type
	}
	if(firstRunner.metadata!=undefined || secondRunner.metadata !=undefined){
		 Matchlist.findOne(newSaveObj,function(err,resp){
			if(resp==null){
				Matchlist.insertMany(newSaveObj,function(err,resp){
					//console.log(resp);
				});
			}
		}); 
	}
	
	/* Matchlist.insertMany(newSaveObj,function(err,resp){
		
	}); */
	
	
}


async function userMatchDetail(req,res){
	
	var matchId = req.params.id;
var myarr=[];
var data=[];
	var axios = require('axios');
	var getSuspendData = await Suspend.findOne({event_id:matchId});
	var isSuspended = (getSuspendData==null) ? 0 : getSuspendData.status;

var getMatchData = await Matchdata.find({match_id:matchId});
var tvStatus = (getMatchData.status_tv==undefined || getMatchData.status_tv=="") ? 0 :getMatchData.status_tv;
var config = {
  method: 'get',
  url: 'http://172.105.37.187/json/1.'+matchId+'.json',
  headers: { 
    'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
  },
  httpsAgent: new https.Agent({
	rejectUnauthorized: false
  })
};

axios(config)
	   .then(async function (response2) {
		 
		if(response2!=undefined){
			if(response2.data){
				res.json({ success: true, data:response2.data });
			}else{
				res.json({ success: false, data:data });
	
			 }
		}else{
			res.json({ success: false, data:data });

		 }
		
}).catch()










	


}

function chunkArray(myArray, chunk_size){
    var results = [];
    
    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }
    
    return results;
}

async function convertUnmatchToMatchCron(req,res){
	// var allMatchData = [];
	
	
	
	//  var getTotalStake =  await Userbet.aggregate([
	// 	{ $match: {type:'unmatch',status:'pending',bet_type: { $not:{ $eq: "fancy" }}}}  ,
		 
	// 	{
	// 	  $group : {
	// 		_id : "$market_id",
	// 	}
	// 	}
	//   ]);
	 
	//  var groupArr =  chunkArray(getTotalStake,10);
	//  for(i=0;i<groupArr.length;i++){
	// 	   var newArr = [];
	// 	    for(j=0;j<groupArr[i].length;j++){
	// 			newArr.push(groupArr[i][j]._id);
	// 		}
	// 		var data = JSON.stringify({"marketIds":newArr});
   
	// 		var config = {
	// 			method: 'post',
	// 			url: 'https://bet247exch.com/odds',
	// 			headers: { 
	// 				'key': 'D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9', 
	// 				'Content-Type': 'application/json', 
	// 				'Cookie': 'XSRF-TOKEN=eyJpdiI6IkpibzE5akRzV0tGUWpcL25XamZ5RjR3PT0iLCJ2YWx1ZSI6ImhzZEhcL1lINHpPSEhPaUxvVXhvU0gybWtET1hUa2Z3Ym5hZVczdHhzQnhObUpHVFB2cFBPNTRhVFVUUVhZYlNHIiwibWFjIjoiOWU1YmVmNjAxYTU4ZDI0ZTRkMDQzZTcwZmYxNDM5MTE0NDUwNDk3YWRjNGRiNzYzNDE5NDE2NThhNDlmMTliOCJ9; laravel_session=eyJpdiI6IkxEdE1paUJPQ1paa3NjYXA4UXBORHc9PSIsInZhbHVlIjoiemFudzBQZmhLTWdKXC9kd2d0OFwvNFwveXUxa1FsNFZaeThrckZZbzg3SUNTODBBUUN5VkJBYTJLcm0rbk9lcU9vbSIsIm1hYyI6ImI2ZjYyNjk3MTgzMzA0MDA5YTE2NmExZDY5MGExMjkzNzM1YTJkZTQzYjQzMjAyYWM1MjNlN2NmMDcyNjIzODYifQ%3D%3D'
	// 			},
	// 			httpsAgent: new https.Agent({
	// 				rejectUnauthorized: false
	// 			}),
	// 			data : data
	// 	   };
		  
	// 		var matchDataArr = await axios(config).then(function (response1) {
	// 								return response1.data.data.result;
									
	// 							})  
								
	// 		 if(matchDataArr!=null){
			
	// 			 for(let matchKey of Object.keys(matchDataArr)){
	// 				  var matchDataArrSingle = matchDataArr[matchKey];
					
	// 					var  values = matchDataArrSingle;
	// 					var matchStatus =  values.status;
	// 					var marketId = values.marketId; 
						
							
	// 					for(var i=0;i<values.runners.length;i++){
	// 						var selectionId = values.runners[i].selectionId;
	// 						var currentRateBack = values.runners[i].ex.availableToBack[0].price;
	// 						var currentRateLay = values.runners[i].ex.availableToLay[0].price;
	// 						var getTeamStatus = values.runners[i].status;
	// 						var getUnMatchOddsBet = await Userbet.find({selection_id: selectionId,type:'unmatch',status:'pending',bet_type: { $not:{ $eq: "fancy" }}});
							
							
	// 						if(getUnMatchOddsBet!=null && getUnMatchOddsBet.length>0){
								
	// 							for(var a=0;a<getUnMatchOddsBet.length;a++){
									
	// 								var userBetData = getUnMatchOddsBet[a];
	// 								var userBetId = userBetData._id;
	// 								var userOdds = userBetData.odds;
	// 								var userCurrentOdds = userBetData.current_market_odds;
	// 								var newOddsValue = (userBetData.bet_type=='back') ? currentRateBack : currentRateLay;
	// 								var userBetNewType = userBetData.type;
								
	// 								if(newOddsValue > userBetData.current_market_odds){
	// 									userBetNewType = (userOdds >=userCurrentOdds && userOdds <= newOddsValue) ? 'match' : userBetNewType;
	// 								}
	// 								else {
	// 									userBetNewType = (userOdds >=newOddsValue && userOdds <= userCurrentOdds ) ? 'match' : userBetNewType;
	// 								}
								
									
	// 								if(userBetNewType=='match') {
	// 									await Userbet.updateOne({_id: new ObjectId(userBetId)}, { $set:{ type: userBetNewType,matchDate:Date.now()} }, {upsert: true},function(err,resu){});
	// 								}
									
	// 							}
	// 						}
							
	// 					} 
	// 				} 
	// 		 }
	// 	}
	// 	return true;
	//  	//res.json({"success":true,"message":"Match Hide Successfully"}) 	
			
}

async function userMatchDetailTest(req,res){
	
// 	var matchId = req.params.id;

// 	var axios = require('axios');

// var config = {
//   method: 'get',
//   url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+req.params.id1+'&match_id='+matchId,
//   headers: { 
//     'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
//   },
//   httpsAgent: new https.Agent({
// 	rejectUnauthorized: false
//   })
// };

// axios(config)
// .then(async function (response) {
//   var newdata=response.data.data.result;
  
// 	if(newdata.length>0) {
		
//    var axios = require('axios');
//    var data = JSON.stringify({"marketIds":[newdata[0].market_id],"result":1});

//    var config = {
// 	 method: 'post',
// 	 url: 'https://bet247exch.com/odds',
// 	 headers: { 
// 	   'key': 'D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9', 
// 	   'Content-Type': 'application/json', 
// 	   'Cookie': 'XSRF-TOKEN=eyJpdiI6IkpibzE5akRzV0tGUWpcL25XamZ5RjR3PT0iLCJ2YWx1ZSI6ImhzZEhcL1lINHpPSEhPaUxvVXhvU0gybWtET1hUa2Z3Ym5hZVczdHhzQnhObUpHVFB2cFBPNTRhVFVUUVhZYlNHIiwibWFjIjoiOWU1YmVmNjAxYTU4ZDI0ZTRkMDQzZTcwZmYxNDM5MTE0NDUwNDk3YWRjNGRiNzYzNDE5NDE2NThhNDlmMTliOCJ9; laravel_session=eyJpdiI6IkxEdE1paUJPQ1paa3NjYXA4UXBORHc9PSIsInZhbHVlIjoiemFudzBQZmhLTWdKXC9kd2d0OFwvNFwveXUxa1FsNFZaeThrckZZbzg3SUNTODBBUUN5VkJBYTJLcm0rbk9lcU9vbSIsIm1hYyI6ImI2ZjYyNjk3MTgzMzA0MDA5YTE2NmExZDY5MGExMjkzNzM1YTJkZTQzYjQzMjAyYWM1MjNlN2NmMDcyNjIzODYifQ%3D%3D'
// 	 },httpsAgent: new https.Agent({
// 		rejectUnauthorized: false
// 	  }),
// 	 data : data
//    };
   
//    axios(config)
//    .then(function (response) {
	
// 	 if(response.data.data.result!=null){
// 		if(response.data.data.result.length==0){
// 			res.json({ success: false, message: 'No Data found',data:[],data1:[] });
// 		}
// 		else {
			

// 			//////////////console.log(response.data.data.result);
// 			 var Oods_data = new Oods();
// 			 Oods_data.matchdata = JSON.stringify({data:response.data.data.result,data1:newdata});

// 			Oods_data.save();
    




// 			res.json({ success: true, message: 'odds List',data:response.data.data.result,data1:newdata  });
// 		} 
// 	 }else {
		
// 		res.json({  success: false, message: 'No Data found',data:[],data1:[] });
// 	} 
	 
//    })
//    .catch(function (error) {
// 	res.json({ success: false, message: 'No Data found',data:[],data1:[] });
//    });
   
// 	}else{
// 		res.json({ success: true, message: 'odds List',data:[],data1:newdata  });
// 	}














// })

















	
}




async function authenticate({ email, password },sessionid) {
	////////console.log(email);
	let user = await User.findOne({ username:email });
	////////////console.log( bcrypt.compareSync(password, user.hash));
    if (user && bcrypt.compareSync(password, user.hash)) {
		
        
		var value1 =updateSession(email,sessionid);
		
		let user = await User.findOne({ username:email });
		
		const { hash, ...userWithoutHash } = user.toObject();
		const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
		};
		
    }
}






function admintotal(req, res) {

	 User.findById({_id:req.user.sub },function (e, mainResult) { 
            if (e) { 
                res.json({ success: false, message: 'No Data found' })
            } else { 
				if(mainResult.userType==1){
					User.find({userType: {$in :[2,3,4,5]}}).count(function (e, count) { 
						if (e) {
							res.json({ success: false, message: 'No Data found' })
						} else {
							res.json({ success: true, message: 'Admin Total', countadmins: count })
						}

					}) ; 
				}
				else if(mainResult.userType==2){
					User.find({ userType: {$in :[3,4,5]},parentid:req.user.sub }).count(function (e, count) {  
						if (e) {
							res.json({ success: false, message: 'No Data found' })
						} else {
							res.json({ success: true, message: 'Admin Total', countadmins: count })
						}

					}) ; 
				}
				else if(mainResult.userType==3){
					User.find({ userType: {$in :[4,5]},parentid:req.user.sub }).count(function (e, count) { 
						if (e) {
							res.json({ success: false, message: 'No Data found' })
						} else {
							res.json({ success: true, message: 'Admin Total', countadmins: count })
						}

					}) ; 
				}
				else if(mainResult.userType==4){
					User.find({ userType: {$in :[5]},parentid:req.user.sub }).count(function (e, count) {  
						if (e) {
							res.json({ success: false, message: 'No Data found' })
						} else {
							res.json({ success: true, message: 'Admin Total', countadmins: count })
						}

					}) ; 
				}
					
			}			
	})

	/* 
    User.find({ userType: 2 }).count(function (e, count) { 
        if (e) {
            res.json({ success: false, message: 'No Data found' })
        } else {
            res.json({ success: true, message: 'admin total', countadmins: count })
        } 
    }); */
}
function usertotal(req, res) {
    User.find({ userType: 3,parentid:req.user.sub }).count(function (e, count) { 
        if (e) {
            res.json({ success: false, message: 'No Data found' })
        } else {
            res.json({ success: true, message: 'user total', countadmins: count })
        }

    });
}
async function adminlist(req, res) { 
	 User.findById({_id:req.user.sub }, function (e, mainResult) { 
            if (e) { 
                res.json({ success: false, message: 'No Data found' })
            } else { 
				if(mainResult==null || mainResult.userType==null){
					User.find({ userType: {$in :[6]}},async function (e, result) { 
						if (e) {
							res.json({ success: false, message: 'No Data found' })
						} else {
							
							var myObj = new Array();
							//return //////////////console.log(result);
							for (let index = 0; index < result.length; index++) {
							//////////////console.log(result);
								var getTotalStake =  await Userbet.aggregate([
									{ $match: { user_id : new ObjectId(result[index].id),status:'pending'}  },
									{
									  $group : {
										_id : null,
										 staketotal: { $sum: { '$toInt': '$stake' } }
									  }
									}
								  ]);
								  var getTotalStackBalance =0;
								  
								if(getTotalStake.length>0){
									 getTotalStackBalance = getTotalStake[0].staketotal	;
								} 
														
								//result.push({datanew : getTotalStackBalance});
							myObj.push({balance: result[index].balance, 
bet_status: result[index].bet_status,
city:result[index].city,
createdDate: result[index].createdDate,
creditAmount: result[index].creditAmount,
cricket: result[index].cricket,
cricket_commission_downline:result[index].cricket_commission_downline,
cricket_commission_own: result[index].cricket_commission_own,
cricket_delay:result[index].cricket_delay,
cricket_max_bet:result[index].cricket_max_bet,
cricket_min_bet: result[index].cricket_min_bet,
cricket_partnership_downline: result[index].cricket_partnership_downline,
cricket_partnership_own: result[index].cricket_partnership_own,
exposerAmount:result[index].exposerAmount,
football: result[index].football,
football_commission_downline: result[index].football_commission_downline,
football_commission_own: result[index].football_commission_own,
football_delay: result[index].football_delay,
football_max_bet: result[index].football_max_bet,
football_min_bet: result[index].football_min_bet,
football_partnership_downline:result[index].football_partnership_downline,
football_partnership_own: result[index].football_partnership_own,
fullname: result[index].fullname,
hash: result[index].hash,
horse_riding: result[index].horse_riding,
id: result[index].id,
parentid: result[index].parentid,
phone: result[index].phone,
profit_loss:result[index].profit_loss,
tennis:result[index].tennis,
tennis_commission_downline: result[index].tennis_commission_downline,
tennis_commission_own: result[index].tennis_commission_own,
tennis_delay: result[index].tennis_delay,
tennis_max_bet: result[index].tennis_max_bet,
tennis_min_bet: result[index].tennis_min_bet,
tennis_partnership_downline:result[index].tennis_partnership_downline,
tennis_partnership_own:result[index].tennis_partnership_own,
userType: result[index].userType,
user_status: result[index].user_status,
username: result[index].username,
verifyCode: result[index].verifyCode,
_id: result[index]._id,
data_new: getTotalStackBalance,	
data_new: getTotalStackBalance,	
					
								
					
							
							
							
							
							});

							
							}
							res.json({ success: true, message: 'Admin Total2', adminlist: myObj })
						}

					}) ; 
				}
				else if(mainResult.userType==1){
					//User.find({userType: {$in :[2,3,4,5,6]},parentid:req.user.sub},async function (e, result) { 
					User.find({userType: {$in :[2,3,4,5,6]}},async function (e, result) { 
						if (e) {
							res.json({ success: false, message: 'No Data found' })
						} else {
							var myObj = new Array();
							//return //////////////console.log(result);
							for (let index = 0; index < result.length; index++) {
								//////////////console.log();
								var getTotalStake =  await Userbet.aggregate([
									{ $match: { user_id : new ObjectId(result[index].id),status:'pending'}  },
									{
									  $group : {
										_id : null,
										 staketotal: { $sum: { '$toInt': '$stake' } }
									  }
									}
								  ]);
								  var getTotalStackBalance =0;
								  
								if(getTotalStake.length>0){
									 getTotalStackBalance = getTotalStake[0].staketotal	;
								} 
														
								//result.push({datanew : getTotalStackBalance});
							myObj.push({balance: result[index].balance, 
bet_status: result[index].bet_status,
city:result[index].city,
createdDate: result[index].createdDate,
creditAmount: result[index].creditAmount,
cricket: result[index].cricket,
cricket_commission_downline:result[index].cricket_commission_downline,
cricket_commission_own: result[index].cricket_commission_own,
cricket_delay:result[index].cricket_delay,
cricket_max_bet:result[index].cricket_max_bet,
cricket_min_bet: result[index].cricket_min_bet,
cricket_partnership_downline: result[index].cricket_partnership_downline,
cricket_partnership_own: result[index].cricket_partnership_own,
exposerAmount:result[index].exposerAmount,
football: result[index].football,
football_commission_downline: result[index].football_commission_downline,
football_commission_own: result[index].football_commission_own,
football_delay: result[index].football_delay,
football_max_bet: result[index].football_max_bet,
football_min_bet: result[index].football_min_bet,
football_partnership_downline:result[index].football_partnership_downline,
football_partnership_own: result[index].football_partnership_own,
fullname: result[index].fullname,
hash: result[index].hash,
horse_riding: result[index].horse_riding,
id: result[index].id,
parentid: result[index].parentid,
phone: result[index].phone,
profit_loss:result[index].profit_loss,
tennis:result[index].tennis,
tennis_commission_downline: result[index].tennis_commission_downline,
tennis_commission_own: result[index].tennis_commission_own,
tennis_delay: result[index].tennis_delay,
tennis_max_bet: result[index].tennis_max_bet,
tennis_min_bet: result[index].tennis_min_bet,
tennis_partnership_downline:result[index].tennis_partnership_downline,
tennis_partnership_own:result[index].tennis_partnership_own,
userType: result[index].userType,
user_status: result[index].user_status,
username: result[index].username,
verifyCode: result[index].verifyCode,
_id: result[index]._id,
data_new: getTotalStackBalance,								
								
								
							
							
							
							
							});

							}
							res.json({ success: true, message: 'Admin Total2', adminlist: myObj })
							
						}

					}) ; 
				}
				else if(mainResult.userType==2){
					User.find({ userType: {$in :[3,4,5,6]},parentid:req.user.sub },async function (e, result) { 
						if (e) {
							res.json({ success: false, message: 'No Data found' })
						} else {
							
							var myObj = new Array();
							//return //////////////console.log(result);
							for (let index = 0; index < result.length; index++) {
								//////////////console.log();
								var getTotalStake =  await Userbet.aggregate([
									{ $match: { user_id : new ObjectId(result[index].id),status:'pending'}  },
									{
									  $group : {
										_id : null,
										 staketotal: { $sum: { '$toInt': '$stake' } }
									  }
									}
								  ]);
								  var getTotalStackBalance =0;
								  
								if(getTotalStake.length>0){
									 getTotalStackBalance = getTotalStake[0].staketotal	;
								} 
														
								//result.push({datanew : getTotalStackBalance});
							myObj.push({balance: result[index].balance, 
bet_status: result[index].bet_status,
city:result[index].city,
createdDate: result[index].createdDate,
creditAmount: result[index].creditAmount,
cricket: result[index].cricket,
cricket_commission_downline:result[index].cricket_commission_downline,
cricket_commission_own: result[index].cricket_commission_own,
cricket_delay:result[index].cricket_delay,
cricket_max_bet:result[index].cricket_max_bet,
cricket_min_bet: result[index].cricket_min_bet,
cricket_partnership_downline: result[index].cricket_partnership_downline,
cricket_partnership_own: result[index].cricket_partnership_own,
exposerAmount:result[index].exposerAmount,
football: result[index].football,
football_commission_downline: result[index].football_commission_downline,
football_commission_own: result[index].football_commission_own,
football_delay: result[index].football_delay,
football_max_bet: result[index].football_max_bet,
football_min_bet: result[index].football_min_bet,
football_partnership_downline:result[index].football_partnership_downline,
football_partnership_own: result[index].football_partnership_own,
fullname: result[index].fullname,
hash: result[index].hash,
horse_riding: result[index].horse_riding,
id: result[index].id,
parentid: result[index].parentid,
phone: result[index].phone,
profit_loss:result[index].profit_loss,
tennis:result[index].tennis,
tennis_commission_downline: result[index].tennis_commission_downline,
tennis_commission_own: result[index].tennis_commission_own,
tennis_delay: result[index].tennis_delay,
tennis_max_bet: result[index].tennis_max_bet,
tennis_min_bet: result[index].tennis_min_bet,
tennis_partnership_downline:result[index].tennis_partnership_downline,
tennis_partnership_own:result[index].tennis_partnership_own,
userType: result[index].userType,
user_status: result[index].user_status,
username: result[index].username,
verifyCode: result[index].verifyCode,
_id: result[index]._id,
data_new: getTotalStackBalance,								
								
								
							
							
							
							
							});

							}
							res.json({ success: true, message: 'Admin Total2', adminlist: myObj })
						}

					}) ; 
				}
				else if(mainResult.userType==3){
					User.find({ userType: {$in :[4,5,6]},parentid:req.user.sub },async function (e, result) { 
						if (e) {
							res.json({ success: false, message: 'No Data found' })
						} else {
							
							var myObj = new Array();
							//return //////////////console.log(result);
							for (let index = 0; index < result.length; index++) {
								//////////////console.log();
								var getTotalStake =  await Userbet.aggregate([
									{ $match: { user_id : new ObjectId(result[index].id),status:'pending'}  },
									{
									  $group : {
										_id : null,
										 staketotal: { $sum: { '$toInt': '$stake' } }
									  }
									}
								  ]);
								  var getTotalStackBalance =0;
								  
								if(getTotalStake.length>0){
									 getTotalStackBalance = getTotalStake[0].staketotal	;
								} 
														
								//result.push({datanew : getTotalStackBalance});
							myObj.push({balance: result[index].balance, 
bet_status: result[index].bet_status,
city:result[index].city,
createdDate: result[index].createdDate,
creditAmount: result[index].creditAmount,
cricket: result[index].cricket,
cricket_commission_downline:result[index].cricket_commission_downline,
cricket_commission_own: result[index].cricket_commission_own,
cricket_delay:result[index].cricket_delay,
cricket_max_bet:result[index].cricket_max_bet,
cricket_min_bet: result[index].cricket_min_bet,
cricket_partnership_downline: result[index].cricket_partnership_downline,
cricket_partnership_own: result[index].cricket_partnership_own,
exposerAmount:result[index].exposerAmount,
football: result[index].football,
football_commission_downline: result[index].football_commission_downline,
football_commission_own: result[index].football_commission_own,
football_delay: result[index].football_delay,
football_max_bet: result[index].football_max_bet,
football_min_bet: result[index].football_min_bet,
football_partnership_downline:result[index].football_partnership_downline,
football_partnership_own: result[index].football_partnership_own,
fullname: result[index].fullname,
hash: result[index].hash,
horse_riding: result[index].horse_riding,
id: result[index].id,
parentid: result[index].parentid,
phone: result[index].phone,
profit_loss:result[index].profit_loss,
tennis:result[index].tennis,
tennis_commission_downline: result[index].tennis_commission_downline,
tennis_commission_own: result[index].tennis_commission_own,
tennis_delay: result[index].tennis_delay,
tennis_max_bet: result[index].tennis_max_bet,
tennis_min_bet: result[index].tennis_min_bet,
tennis_partnership_downline:result[index].tennis_partnership_downline,
tennis_partnership_own:result[index].tennis_partnership_own,
userType: result[index].userType,
user_status: result[index].user_status,
username: result[index].username,
verifyCode: result[index].verifyCode,
_id: result[index]._id,
data_new: getTotalStackBalance,								
								
								
							
							
							
							
							});

							}
							res.json({ success: true, message: 'Admin Total2', adminlist: myObj })
						}

					}) ; 
				}
				else if(mainResult.userType==4){
					User.find({ userType: {$in :[5,6]},parentid:req.user.sub },async function (e, result) { 
						if (e) {
							res.json({ success: false, message: 'No Data found' })
						} else {
							
							var myObj = new Array();
							//return //////////////console.log(result);
							for (let index = 0; index < result.length; index++) {
								//////////////console.log();
								var getTotalStake =  await Userbet.aggregate([
									{ $match: { user_id : new ObjectId(result[index].id),status:'pending'}  },
									{
									  $group : {
										_id : null,
										 staketotal: { $sum: { '$toInt': '$stake' } }
									  }
									}
								  ]);
								  var getTotalStackBalance =0;
								  
								if(getTotalStake.length>0){
									 getTotalStackBalance = getTotalStake[0].staketotal	;
								} 
														
								//result.push({datanew : getTotalStackBalance});
							myObj.push({balance: result[index].balance, 
bet_status: result[index].bet_status,
city:result[index].city,
createdDate: result[index].createdDate,
creditAmount: result[index].creditAmount,
cricket: result[index].cricket,
cricket_commission_downline:result[index].cricket_commission_downline,
cricket_commission_own: result[index].cricket_commission_own,
cricket_delay:result[index].cricket_delay,
cricket_max_bet:result[index].cricket_max_bet,
cricket_min_bet: result[index].cricket_min_bet,
cricket_partnership_downline: result[index].cricket_partnership_downline,
cricket_partnership_own: result[index].cricket_partnership_own,
exposerAmount:result[index].exposerAmount,
football: result[index].football,
football_commission_downline: result[index].football_commission_downline,
football_commission_own: result[index].football_commission_own,
football_delay: result[index].football_delay,
football_max_bet: result[index].football_max_bet,
football_min_bet: result[index].football_min_bet,
football_partnership_downline:result[index].football_partnership_downline,
football_partnership_own: result[index].football_partnership_own,
fullname: result[index].fullname,
hash: result[index].hash,
horse_riding: result[index].horse_riding,
id: result[index].id,
parentid: result[index].parentid,
phone: result[index].phone,
profit_loss:result[index].profit_loss,
tennis:result[index].tennis,
tennis_commission_downline: result[index].tennis_commission_downline,
tennis_commission_own: result[index].tennis_commission_own,
tennis_delay: result[index].tennis_delay,
tennis_max_bet: result[index].tennis_max_bet,
tennis_min_bet: result[index].tennis_min_bet,
tennis_partnership_downline:result[index].tennis_partnership_downline,
tennis_partnership_own:result[index].tennis_partnership_own,
userType: result[index].userType,
user_status: result[index].user_status,
username: result[index].username,
verifyCode: result[index].verifyCode,
_id: result[index]._id,
data_new: getTotalStackBalance,								
								
								
							
							
							
							
							});

							}
							res.json({ success: true, message: 'Admin Total2', adminlist: myObj })
						}

					}) ; 
				}else if(mainResult.userType==5){
					
					User.find({userType: {$in :[6]},parentid:req.user.sub},async function (e, result) { 
						if (e) {
							res.json({ success: false, message: 'No Data found' })
						} else {
							var myObj = new Array();
							//return //////////////console.log(result);
							for (let index = 0; index < result.length; index++) {
								//////////////console.log();
								var getTotalStake =  await Userbet.aggregate([
									{ $match: { user_id : new ObjectId(result[index].id),status:'pending'}  },
									{
									  $group : {
										_id : null,
										 staketotal: { $sum: { '$toInt': '$stake' } }
									  }
									}
								  ]);
								  var getTotalStackBalance =0;
								  
								if(getTotalStake.length>0){
									 getTotalStackBalance = getTotalStake[0].staketotal	;
								} 
														
								//result.push({datanew : getTotalStackBalance});
							myObj.push({balance: result[index].balance, 
bet_status: result[index].bet_status,
city:result[index].city,
createdDate: result[index].createdDate,
creditAmount: result[index].creditAmount,
cricket: result[index].cricket,
cricket_commission_downline:result[index].cricket_commission_downline,
cricket_commission_own: result[index].cricket_commission_own,
cricket_delay:result[index].cricket_delay,
cricket_max_bet:result[index].cricket_max_bet,
cricket_min_bet: result[index].cricket_min_bet,
cricket_partnership_downline: result[index].cricket_partnership_downline,
cricket_partnership_own: result[index].cricket_partnership_own,
exposerAmount:result[index].exposerAmount,
football: result[index].football,
football_commission_downline: result[index].football_commission_downline,
football_commission_own: result[index].football_commission_own,
football_delay: result[index].football_delay,
football_max_bet: result[index].football_max_bet,
football_min_bet: result[index].football_min_bet,
football_partnership_downline:result[index].football_partnership_downline,
football_partnership_own: result[index].football_partnership_own,
fullname: result[index].fullname,
hash: result[index].hash,
horse_riding: result[index].horse_riding,
id: result[index].id,
parentid: result[index].parentid,
phone: result[index].phone,
profit_loss:result[index].profit_loss,
tennis:result[index].tennis,
tennis_commission_downline: result[index].tennis_commission_downline,
tennis_commission_own: result[index].tennis_commission_own,
tennis_delay: result[index].tennis_delay,
tennis_max_bet: result[index].tennis_max_bet,
tennis_min_bet: result[index].tennis_min_bet,
tennis_partnership_downline:result[index].tennis_partnership_downline,
tennis_partnership_own:result[index].tennis_partnership_own,
userType: result[index].userType,
user_status: result[index].user_status,
username: result[index].username,
verifyCode: result[index].verifyCode,
_id: result[index]._id,
data_new: getTotalStackBalance,								
								
								
							
							
							
							
							});

							}
							res.json({ success: true, message: 'Admin Total2', adminlist: myObj })
							
						}

					}) ; 
				}

					
			}			
	})
}



async function current_user_data(req, res) { 

	User.findOne({_id: new ObjectId(req.user.sub)},async function (e, result) { 
		if (e) {
			res.json({ success: false, message: 'No Data found' })
		} else {
			
			res.json({ success: true, message: 'List',data: result})
		}	
	});  

}


async function adminlistparent(req, res) { 

			  
				   User.find({ parentid: req.params.id},async function (e, result) { 
					   if (e) {
						   res.json({ success: false, message: 'No Data found' })
					   } else {
						   
						   var myObj = new Array();
						   //return //////////////console.log(result);
						   for (let index = 0; index < result.length; index++) {
						   ////////console.log(result);
							   var getTotalStake =  await Userbet.aggregate([
								   { $match: { user_id : new ObjectId(result[index].id),status:'pending'}  },
								   {
									 $group : {
									   _id : null,
										staketotal: { $sum: { '$toInt': '$stake' }}
									 }
								   }
								 ]);
								 var getTotalStackBalance =0;
								 
							   if(getTotalStake.length>0){
									getTotalStackBalance = getTotalStake[0].staketotal	;
							   } 
													   
							   //result.push({datanew : getTotalStackBalance});
						   myObj.push({balance: result[index].balance, 
bet_status: result[index].bet_status,
city:result[index].city,
createdDate: result[index].createdDate,
creditAmount: result[index].creditAmount,
cricket: result[index].cricket,
cricket_commission_downline:result[index].cricket_commission_downline,
cricket_commission_own: result[index].cricket_commission_own,
cricket_delay:result[index].cricket_delay,
cricket_max_bet:result[index].cricket_max_bet,
cricket_min_bet: result[index].cricket_min_bet,
cricket_partnership_downline: result[index].cricket_partnership_downline,
cricket_partnership_own: result[index].cricket_partnership_own,
exposerAmount:result[index].exposerAmount,
football: result[index].football,
football_commission_downline: result[index].football_commission_downline,
football_commission_own: result[index].football_commission_own,
football_delay: result[index].football_delay,
football_max_bet: result[index].football_max_bet,
football_min_bet: result[index].football_min_bet,
football_partnership_downline:result[index].football_partnership_downline,
football_partnership_own: result[index].football_partnership_own,
fullname: result[index].fullname,
hash: result[index].hash,
horse_riding: result[index].horse_riding,
id: result[index].id,
parentid: result[index].parentid,
phone: result[index].phone,
profit_loss:result[index].profit_loss,
tennis:result[index].tennis,
tennis_commission_downline: result[index].tennis_commission_downline,
tennis_commission_own: result[index].tennis_commission_own,
tennis_delay: result[index].tennis_delay,
tennis_max_bet: result[index].tennis_max_bet,
tennis_min_bet: result[index].tennis_min_bet,
tennis_partnership_downline:result[index].tennis_partnership_downline,
tennis_partnership_own:result[index].tennis_partnership_own,
userType: result[index].userType,
user_status: result[index].user_status,
username: result[index].username,
verifyCode: result[index].verifyCode,
_id: result[index]._id,
data_new: getTotalStackBalance,	
					   
							   
							   
						   
						   
						   
						   
						   });

						   
						   }
						   res.json({ success: true, message: 'Admin Total2', adminlist: myObj })
					   }

				   }) ; 
			   }
			 
				   
		   			
  









function fancybetlist(req, res) { 
    Fancybet.find({user_id:req.user.sub },function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Data found' })
        } else {
            res.json({ success: true, message: 'Fancy Bet List', fancybetlist: result })
        }

    }) ;   
}
function fancybetlistFront(req, res) {   
    User.findById({_id:req.user.sub },function (e, result) { 
            if (e) { 
                res.json({ success: false, message: 'No Data found' })
            } else { 
				if(result!==null){
					Fancybet.find({user_id:result.parentid },function (e, result) {  
						res.json({ success: true, message: 'Fancy Bet List', fancybetlist: result })
					 }) ; 
				}
				else {
					res.json({ success: false, message: 'No Data found' })
				}
            } 
        }) ;

    // Fancybet.find({user_id:req.user.sub },function (e, result) { 
    //     if (e) {
    //         res.json({ success: false, message: 'No Data found' })
    //     } else {
    //         res.json({ success: true, message: 'Fancy Bet List', fancybetlist: result })
    //     }

    // }) ;   
}
function getgameassignuser(req,res) {
    User.find({ id: userParam.id },function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Data found' })
        } else {
            res.json({ success: true, message: 'admin total', getgameassignuser: result })
        }

    }) ;   
}
function userlist(req, res) {
    User.find({userType: 3,parentid:req.user.sub },function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Data found' })
        } else {
            res.json({ success: true, message: 'user list', userlist: result })
        } 
    }) ;    
}

function userbetlist(req, res) {
	var matchid = req.params.id;
	//////////////console.log(req.params.id);
    Userbet.find({user_id:req.user.sub,event_id:matchid, status:"pending",},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
	
	
  }
	
	
	  



function userbetlist_new(req, res) {
	
	//////////////console.log(req.params.id);
    Userbet.find({user_id:req.user.sub},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}

async function userbetlist_new_data(req, res) {
	

	
	if(req.body.event_type!='' && req.body.event_type!=undefined){
		var startDate=req.body.startDate;
	var endDate=req.body.endDate;
	
	var res11 = startDate.split("T");
	var res1 = endDate.split("T");
	
		await Userbet.find(

			{
				// $and : [
				// 		 { 
				// 		   $or : [ 
				// 					{ remark: "profit" },
				// 					{ remark: "loss" } 
				// 				 ]
				// 		 },
						 user_id:new ObjectId(req.user.sub),createdDate:{$gt:res11[0],$lt:res1[0]},event_type:req.body.event_type
					   //]
			  }
		).populate('userbet_id').populate('amount_given_by').exec(function (e, result) { 
			//////////////console.log(result);
			if(result!=undefined){
				if (result.length>0) {
					res.json({ success: true, message: 'bet list', showdata: result });
				} else {
					res.json({ success: false, message: 'bet list', showdata: [] });
				}
			}else{
				res.json({ success: false, message: 'bet list', showdata: [] });
			}
			
	
		}) ; 
	}else if(req.body.type!='' && req.body.type!=undefined){
		var startDate=req.body.startDate;
	var endDate=req.body.endDate;
	
	var res11 = startDate.split("T");
	var res1 = endDate.split("T");
	
		await Userbet.find(

			{
				
				
						 user_id:new ObjectId(req.user.sub),createdDate:{$gt:res11[0],$lt:res1[0]},type:req.body.type
					   
			  }
		).populate('userbet_id').populate('amount_given_by').exec(function (e, result) { 
			//////////////console.log(result);
			if(result!=undefined){
				if (result.length>0) {
					res.json({ success: true, message: 'bet list', showdata: result });
				} else {
					res.json({ success: false, message: 'bet list', showdata: [] });
				}
			}else{
				res.json({ success: false, message: 'bet list', showdata: [] });
			}
	
		}) ; 

	}
	
	else if(req.body.type_data!='' && req.body.type_data!=undefined){
		
	
		await Userbet.find(

			{
				
				
						 user_id:new ObjectId(req.user.sub),type:req.body.type_data
					   
			  }
		).populate('userbet_id').populate('amount_given_by').exec(function (e, result) { 
			//////////////console.log(result);
			if(result!=undefined){
				if (result.length>0) {
					res.json({ success: true, message: 'bet list', showdata: result });
				} else {
					res.json({ success: false, message: 'bet list', showdata: [] });
				}
			}else{
				res.json({ success: false, message: 'bet list', showdata: [] });
			}
	
		}) ; 

	}
	
	
	
	
	
	
	
	
	else{
		var startDate=req.body.startDate;
	var endDate=req.body.endDate;
	////////////console.log(startDate);
	var res11 = startDate.split("T");
	var res1 = endDate.split("T");
	////////////console.log(req.body.event_type);
		await Userbet.find(

			{
				
				
						 user_id:new ObjectId(req.user.sub),createdDate:{$gt:res11[0],$lt:res1[0]}
					   
			  }
		).populate('userbet_id').populate('amount_given_by').exec(function (e, result) { 
			//////////////console.log(result);
			if (result.length>0) {
				res.json({ success: true, message: 'bet list', showdata: result });
			} else {
				res.json({ success: false, message: 'bet list', showdata: [] });
			}
	
		}) ; 
	}
	






}



function alluserbetlist(req, res) {
    Userbet.find({},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}


async function getAll(req, res) {
	res.json({ success: true, message: 'Good Bye' }) 
    //return await User.find().select('-hash');
}

async function getById(id) {
	
    return await User.findById(id).select('-hash');
}

async function create(req, res) { 
  var userParam = req.body;
  var currentUserId = req.user.sub;
		const user1 = await User.findById(currentUserId);  


   User.findOne({ username: userParam.username }).countDocuments(async function (e, count) { 
        if (count>0) {
            res.json({ success: false, message: 'Username already Exist' })
		}
		
    // if (!user) {
	// 	res.json({ success: true, message: 'User Not Found',data:{availableBalance:0} });
	// }
	// ////////////console.log( bcrypt.compareSync(password, user.hash));
    // if (user && bcrypt.compareSync(password, user.hash)) {
		
		
		else {


			if (user1 && bcrypt.compareSync(userParam.master_password1, user1.hash)) {
			


				const user = new User(userParam);
				var today = new Date();
				var randString = today;
				var genToken = md5(randString);
				user.verifyCode = genToken; 
			   //user.userType = 2;
				user.email = today+"@gmail.com";
				user.parentid = req.user.sub;
				user.emailVerify = 'Y'; 
				if (userParam.password) {
					user.hash = bcrypt.hashSync(userParam.password, 10);
					user.hash_new = bcrypt.hashSync(userParam.password, 10);
				} 
				
					
				
				
				
				if(user.save()){
					
					const explimit = new Exposerlimit();
					explimit.user_id = user._id;
					explimit.amount = userParam.exposerAmount;
					explimit.save();
					
					const creditObj = new Creditamount();
					creditObj.user_id = user._id;
					creditObj.amount = userParam.creditAmount;
					creditObj.save();
					
					res.json({"success":true,"message":"Registered Successfully"})
				}
				else {
					res.json({"success":false,"message":"Unable to register"})
				}
				
				
			/* }
			catch(err) { 
				res.json({"success":false,"message":err})  
			} */
        }else{
			res.json({ success: false, message: 'Master Password does not match.' })
		}
	}
    });
		
}

async function createuser(req,userParam) { 
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    } 
    if (await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    } 
    const user = new User(userParam);
    var today = new Date();
    var randString = today;
    var genToken = md5(randString);
    user.verifyCode = genToken; 
    user.userType = 3;
    user.emailVerify = 'Y'; 
    user.parentid = req.user.sub; 
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    } 
    await user.save();
}
async function addfancybet(userParam) {  
    const fancybet = new Fancybet(userParam);
    var today = new Date();  
     
    fancybet.user_id = userParam.user_id; 
    fancybet.title = userParam.title;
    fancybet.yes_first = userParam.yes_first;
    fancybet.yes_second = userParam.yes_second;
    fancybet.no_first = userParam.no_first;
    fancybet.no_second = userParam.no_second;
    fancybet.minimum = userParam.minimum;
    fancybet.maximum = userParam.maximum;
    fancybet.createdDate = today; 
    await fancybet.save();
}

async function addnewmatch(req, res) {  
   userParam = req.body;
	var gameType="cricket";
	if(userParam.sport_id==4){
		 gameType="cricket";
	}
	else if(userParam.sport_id==1){
		 gameType="soccer";
	}
	else if(userParam.sport_id==2){
		 gameType="tennis";
	}
	
	var checkMatchExist = await Manualmatch.find({match_id:parseInt(userParam.match_id)});
	if(checkMatchExist!=null && checkMatchExist.length>0) {
		 res.json({ "success":false,"message":"match already exist"});
	}
	else {
		
		var newobj={match_name:userParam.match_name,
					match_id:userParam.match_id,
					open_date:userParam.open_date,
					countryCode:null,
					series_id:0,
					series_name:'manual',
					sport_id:userParam.sport_id,
					sport_type:gameType
					};
		 
		 Manualmatch.insertMany(newobj,function(err,resu){
				if (err) {
					  res.json({ "success":false,"message":"unable to add match",errshow: err});
				  }
				  else {
					  updateMatchJson();
					  saveFancyToDb(userParam.match_id,gameType,userParam.match_name);
					  res.json({ "success":true,"message":"match added successfully" });
				  }
			}); 
		
	}
	
	
  
}


async function saveFancyToDb(eventId,eventType,eventName){
	  var marketId = "1."+eventId;
	   var config = {
		 method: 'get',
		 url: 'http://172.105.37.187/json/1.'+eventId+'.json',
		 headers: { 
		   'key': 'D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9', 
		   'Content-Type': 'application/json', 
		   'Cookie': 'XSRF-TOKEN=eyJpdiI6IkpibzE5akRzV0tGUWpcL25XamZ5RjR3PT0iLCJ2YWx1ZSI6ImhzZEhcL1lINHpPSEhPaUxvVXhvU0gybWtET1hUa2Z3Ym5hZVczdHhzQnhObUpHVFB2cFBPNTRhVFVUUVhZYlNHIiwibWFjIjoiOWU1YmVmNjAxYTU4ZDI0ZTRkMDQzZTcwZmYxNDM5MTE0NDUwNDk3YWRjNGRiNzYzNDE5NDE2NThhNDlmMTliOCJ9; laravel_session=eyJpdiI6IkxEdE1paUJPQ1paa3NjYXA4UXBORHc9PSIsInZhbHVlIjoiemFudzBQZmhLTWdKXC9kd2d0OFwvNFwveXUxa1FsNFZaeThrckZZbzg3SUNTODBBUUN5VkJBYTJLcm0rbk9lcU9vbSIsIm1hYyI6ImI2ZjYyNjk3MTgzMzA0MDA5YTE2NmExZDY5MGExMjkzNzM1YTJkZTQzYjQzMjAyYWM1MjNlN2NmMDcyNjIzODYifQ%3D%3D'
		 },httpsAgent: new https.Agent({
			rejectUnauthorized: false
		  }),
		 };
	   
	   await  axios(config)
	   .then(async function (response) {

		 if(response!=undefined || response!='' ||response!=null ){
			
				if(response.data.session!=undefined && response.data.session.length>0){
					var fancyData = response.data.session;
					var insertArr = [];
					for(var i=0; i<fancyData.length;i++){
						var singleFancyData = fancyData[i];
						var singleInsertObj = { market_id : marketId,
												event_id : eventId,
												event_type : eventType,
												event_name : eventName,
												fancy_name : singleFancyData.RunnerName, 
												lay_price : singleFancyData.LayPrice1, 
												lay_size : singleFancyData.LaySize1,
												back_price : singleFancyData.BackPrice1, 
												back_size : singleFancyData.BackSize1
												};
						insertArr.push(singleInsertObj);						
					}	
					await Fancylist.insertMany(insertArr,function(err,resu){});
					
				}
				return true;
		  
			} 
		 else {

			return true;
		} 
		 
	   })
	   .catch(function (error) {
	
		return true;
	
	});
	
}

async function updateMatchJson(){
	// UPDATE Cricket Json START
	await Manualmatch.find({sport_type:'cricket'},function(err,getResultArr){
		if(getResultArr){
			var newUnmatchArr = [];
			var newSaveArr = [];
			var makerArr=[];
			for(i=0;i<getResultArr.length;i++){
				var getResult = getResultArr[i];
				var newUnmatchObj = {
					match_name:getResult.match_name,
					match_id:getResult.match_id,
					open_date:getResult.open_date,
					countryCode:null,
					series_id:0,
					series_name:'manual',
					sport_id:getResult.sport_id,
					sport_type:getResult.sport_type
				}
				makerArr.push([1]);
				newUnmatchArr.push(newUnmatchObj);
			}
				Match.findOne({type:"cricket"},function(myErr,myResult){
					if(myResult){
						var getMatchData = JSON.parse(myResult.cricket).myArr;
						var manualFound = 0;
						for(j=0;j<getMatchData.length;j++){
							var internalArr = getMatchData[j];
							if(internalArr[0].series_name!='manual'){
								newSaveArr.push(internalArr);
							}
						}
						newSaveArr.push(newUnmatchArr);
						var finalObj = JSON.stringify({myArr:newSaveArr});
					
						Match.updateOne({_id:new ObjectId(myResult._id)}, {$set: { cricket: finalObj }}, {upsert: true},function(updateErr,updateResult){
							//console.log(updateResult);
						});
					}
					else {
						 newSaveArr.push(newUnmatchArr);
						 var finalObj = JSON.stringify({myArr:newSaveArr});
						 var finalObjMaker = JSON.stringify({myArr1:makerArr});
						 var newSaveCricketObj = new Match();
						 newSaveCricketObj.cricket = finalObj;
						 newSaveCricketObj.cricket_bookmaker = finalObjMaker;
						  
						 newSaveCricketObj.type ="cricket";
						 newSaveCricketObj.save();
					}
				});
		}
	});
	// UPDATE Cricket Json END
	
	
	// UPDATE soccer Json START
	await Manualmatch.find({sport_type:'soccer'},function(err,getResultArr){
		if(getResultArr){
			var newUnmatchArr = [];
			var newSaveArr = [];
			var makerArr=[];
			for(i=0;i<getResultArr.length;i++){
				var getResult = getResultArr[i];
				var newUnmatchObj = {
					match_name:getResult.match_name,
					match_id:getResult.match_id,
					open_date:getResult.open_date,
					countryCode:null,
					series_id:0,
					series_name:'manual',
					sport_id:getResult.sport_id,
					sport_type:getResult.sport_type
				}
				makerArr.push([1]);;
				newUnmatchArr.push(newUnmatchObj);
			}
				Match.findOne({type:"soccer"},function(myErr,myResult){
					if(myResult) {
						var getMatchData = JSON.parse(myResult.soccer).myArr;
						var manualFound = 0;
						for(j=0;j<getMatchData.length;j++){
							
							var internalArr = getMatchData[j];
							if(internalArr.length>0 && internalArr[0].series_name!='manual'){
								newSaveArr.push(internalArr);
							}
						}
					
						newSaveArr.push(newUnmatchArr);
						var finalObj = JSON.stringify({myArr:newSaveArr});
					
						Match.updateOne({_id:new ObjectId(myResult._id)}, {$set: { soccer: finalObj }}, {upsert: true},function(updateErr,updateResult){
							//console.log(updateResult);
						}); 
					}
					else {
						 newSaveArr.push(newUnmatchArr);
						 var finalObj = JSON.stringify({myArr:newSaveArr});
						 var finalObjMaker = JSON.stringify({myArr1:makerArr});
						 var newSaveSoccerObj = new Match();
						 newSaveSoccerObj.soccer = finalObj;
						 newSaveSoccerObj.soccer_bookmaker = finalObjMaker;
						  
						 newSaveSoccerObj.type ="soccer";
						 newSaveSoccerObj.save();
					}
					
				});
		}
	});
	// UPDATE soccer Json END
	
	
	// UPDATE tennis Json START
	await Manualmatch.find({sport_type:'tennis'},function(err,getResultArr){
		if(getResultArr){
			var newUnmatchArr = [];
			var newSaveArr = [];
			var makerArr=[];
			for(i=0;i<getResultArr.length;i++){
				var getResult = getResultArr[i];
				var newUnmatchObj = {
					match_name:getResult.match_name,
					match_id:getResult.match_id,
					open_date:getResult.open_date,
					countryCode:null,
					series_id:0,
					series_name:'manual',
					sport_id:getResult.sport_id,
					sport_type:getResult.sport_type
				}
				makerArr.push([1]);
				newUnmatchArr.push(newUnmatchObj);
			}
				Match.findOne({type:"tennis"},function(myErr,myResult){
					if(myResult) {
						var getMatchData = JSON.parse(myResult.tennis).myArr;
						var manualFound = 0;
						for(j=0;j<getMatchData.length;j++){
							var internalArr = getMatchData[j];
							if(internalArr[0].series_name!='manual'){
								newSaveArr.push(internalArr);
							}
						}
						newSaveArr.push(newUnmatchArr);
						var finalObj = JSON.stringify({myArr:newSaveArr});
					
						Match.updateOne({_id:new ObjectId(myResult._id)}, {$set: { tennis: finalObj }}, {upsert: true},function(updateErr,updateResult){
							//console.log(updateResult);
						});
					}
					else {
						 newSaveArr.push(newUnmatchArr);
						 var finalObj = JSON.stringify({myArr:newSaveArr});
						 var finalObjMaker = JSON.stringify({myArr1:makerArr});
						 var newSaveTennisObj = new Match();
						 newSaveTennisObj.tennis = finalObj;
						 newSaveTennisObj.tennis_bookmaker = finalObjMaker;
						  
						 newSaveTennisObj.type ="tennis";
						 newSaveTennisObj.save();
					}
							
				});
		}
	});
	// UPDATE tennis Json END
}  
 

async function userCurrentBalance(req, res) {  
	var userParam = req.body;
	var currentUserId = req.user.sub;
	var today = new Date();
	
	const user = await User.findById(currentUserId);  
    if (!user) {
		res.json({ success: true, message: 'User Not Found',data:{availableBalance:0} });
	}
	else {
		var getTotalStackBalance = 0;
		var ObjectId = require('mongoose').Types.ObjectId; 
		var getTotalStake =  await Userbet.aggregate([
								  { $match: { user_id : new ObjectId(currentUserId),status:{ $ne: 'deleted' } }},
								  {
									$group : {
									  _id : null,
									   staketotal: { $sum: "$stake"}
									}
								  }
								]);
							
		
		if(getTotalStake.length!=0){
			getTotalStackBalance = getTotalStake[0].staketotal	;
		} 
		
		
		var availableBalance = user.balance - getTotalStackBalance;

		res.json({ success: true, message: 'Balance',data:{availableBalance:availableBalance} });
	
	}
}

async function createbetuser(req, res) {  
	var userParam = req.body;
	var currentUserId = req.user.sub;
	var today = new Date();
	
const sportdata = await Sport.findOne({sport_name:req.body.event_type,status:"Inactive"}); 

if(sportdata!=undefined){
		res.json({ success: false, message: 'This Sports is Inactive' });
		return false;
	}

	const user = await User.findOne({_id:currentUserId}); 
	var eventType = req.body.event_type;
	var userMinBetLimitExist = false;
	var userMaxBetLimitExist = false;
	
	var compareUserMinBetAmount = (eventType=="cricket") ? user.cricket_min_bet : ((eventType=="soccer") ? user.football_min_bet : ((eventType=="tennis") ? user.tennis_min_bet : 0));
	
	var compareUserMaxBetAmount = (eventType=="cricket") ? user.cricket_max_bet : ((eventType=="soccer") ? user.football_max_bet : ((eventType=="tennis") ? user.tennis_max_bet : 0));
	
	// match bet amount with user min max limit START	
		if(userParam.bet_on!="fancy"){
			if(compareUserMinBetAmount>0){
				userMinBetLimitExist=true;
				if(parseFloat(userParam.stake) < parseFloat(compareUserMinBetAmount)){
					res.json({ success: false, message: 'Min Limit Exceed' });
					return true;
				}
			}
			if(compareUserMaxBetAmount>0){
				userMaxBetLimitExist=true;
				if(parseFloat(userParam.stake) > parseFloat(compareUserMaxBetAmount)){
					res.json({ success: false, message: 'Max Limit Exceed' });
					return true;
				}
			}
		}
	
	// match bet amount with user min max limit END
	
	
	const betlock = await Betlock.findOne({user_id:currentUserId,type:userParam.type1,status:1,event_id:req.body.event_id}); 
	if(betlock!=undefined && betlock!=null && betlock!=''){
		res.json({ success: false, message: 'Bet Lock By Upline' });
		return false;
	}
	if(user.bet_status==='N'){
		res.json({ success: false, message: 'Bet Lock By Admin' });
		return false;
	}
	var getSuspendData = await Suspend.findOne({event_id:userParam.event_id});
	var isSuspended = (getSuspendData==null) ? 0 : getSuspendData.status;
	
	if(isSuspended > 0){
		res.json({ success: false, message: 'Match Suspended' });
	}
    else if (!user) {
		res.json({ success: false, message: 'User Not Found' });
	}
	else {
		  if(userParam.bet_on=="manual_bookmaker"){
			var getBookmakerData = await Bookmakerlist.findOne({match_id:userParam.event_id}).sort({_id:-1}).exec();
			if(userMinBetLimitExist == false && parseFloat(userParam.stake) < parseFloat(getBookmakerData.min_bookmaker_limit)){
				res.json({ success: false, message: 'Min Limit Exceed' });
				return true;
			}
			if(userMaxBetLimitExist == false && parseFloat(userParam.stake) > parseFloat(getBookmakerData.max_bookmaker_limit)){
				res.json({ success: false, message: 'Max Limit Exceed' });
				return true;
			}
		} 
		
		var getTotalStackBalance = 0;
		
		var getTotalStake =  await Userbet.aggregate([
								  { $match: { user_id : new ObjectId(currentUserId), status:'pending' }},
								  {
									$group : {
									  "_id": null,
									   staketotal: { $sum: { '$toInt': '$exposure' }}
									}
								  }
								]);
							
		
		if(getTotalStake.length!=0){
			getTotalStackBalance = Math.abs(getTotalStake[0].staketotal) 	;
			
		} 
		
		var availableBalance = user.balance  + user.profit_loss - getTotalStackBalance;
		var remainingExposure = user.exposerAmount - getTotalStackBalance
		
		const betLimitData = await Maximumbetlimit.findOne({ "event_id": userParam.event_id });
		
		if(userParam.bet_on=="fancy"){
			
			/* if(userMinBetLimitExist == false && betLimitData!=null && betLimitData.fancy_minimum_bet_limit!=null && parseFloat(userParam.stake) < parseFloat(betLimitData.fancy_minimum_bet_limit)){
				res.json({ success: false, message: 'Min Limit Exceed' });
				return true;
			}
			if(userMaxBetLimitExist == false && betLimitData!=null && betLimitData.fancy_maximum_bet_limit!=null && parseFloat(userParam.stake) > parseFloat(betLimitData.fancy_maximum_bet_limit)){
				res.json({ success: false, message: 'Max Limit Exceed' });
				return true;
			} */
			
			
			if(betLimitData!=null && betLimitData.fancy_minimum_bet_limit!=null && parseFloat(userParam.stake) < parseFloat(betLimitData.fancy_minimum_bet_limit)){
				res.json({ success: false, message: 'Min Limit Exceed' });
				return true;
			}
			if(betLimitData!=null && betLimitData.fancy_maximum_bet_limit!=null && parseFloat(userParam.stake) > parseFloat(betLimitData.fancy_maximum_bet_limit)){
				res.json({ success: false, message: 'Max Limit Exceed' });
				return true;
			}
		} 
		
		if(userParam.bet_on=="bookmaker"){
			
			if(userMinBetLimitExist == false && betLimitData!=null && betLimitData.bookmaker_minimum_bet_limit!=null && parseFloat(userParam.stake) < parseFloat(betLimitData.bookmaker_minimum_bet_limit)){
				res.json({ success: false, message: 'Min Limit Exceed' });
				return true;
			}
			if(userMaxBetLimitExist == false && betLimitData!=null && betLimitData.bookmaker_maximum_bet_limit!=null && parseFloat(userParam.stake) > parseFloat(betLimitData.bookmaker_maximum_bet_limit)){
				res.json({ success: false, message: 'Max Limit Exceed' });
				return true;
			}
		} 
		
		if(userParam.bet_on=="odds"){
			
			if(userMinBetLimitExist == false && betLimitData!=null && betLimitData.minimum_bet_limit!=null && parseFloat(userParam.stake) < parseFloat(betLimitData.minimum_bet_limit)){
				res.json({ success: false, message: 'Min Limit Exceed' });
				return true;
			}
			if(userMaxBetLimitExist == false && betLimitData!=null && betLimitData.maximum_bet_limit!=null && parseFloat(userParam.stake) > parseFloat(betLimitData.maximum_bet_limit)){
				res.json({ success: false, message: 'Max Limit Exceed' });
				return true;
			}
		} 
		
		
		
		/* if(betLimitData!=undefined && betLimitData.maximum_bet_limit!=undefined  && betLimitData.minimum_bet_limit!=undefined && ( parseFloat(userParam.stake)>parseFloat(betLimitData.maximum_bet_limit) || parseFloat(userParam.stake) < parseFloat(betLimitData.minimum_bet_limit))){
			res.json({ success: false, message: 'Maximum / Minimum bet Limit excced',MinMax:betLimitData })
		}
		else if(betLimitData!=undefined && betLimitData.maximum_bet_limit!=undefined && parseFloat(userParam.stake)>parseFloat(betLimitData.maximum_bet_limit)){
			res.json({ success: false, message: 'Maximum / Minimum bet Limit excced',max:betLimitData })
		}
		else if(betLimitData!=undefined && betLimitData.minimum_bet_limit!=undefined && parseFloat(userParam.stake)<parseFloat(betLimitData.minimum_bet_limit)){
			res.json({ success: false, message: 'Maximum / Minimum bet Limit excced',min:betLimitData })
		} */
		if(parseFloat(userParam.stake) > parseFloat(remainingExposure)){
			res.json({ success: false, message: 'Maximum  Exposure Limit excced',remainingExposure:remainingExposure })
		}
		else if(parseFloat(availableBalance)<parseFloat(userParam.stake)) {
			res.json({ success: false, message: 'Insufficient Balance',availableBalance:availableBalance })
		}
		else {
		
			const userbet = new Userbet(userParam); 
			userbet.user_id = new Object(currentUserId);
			userbet.createdDate = today;
			
			if(await userbet.save()) {
				res.json({ success: true, message: 'Bet Added successfully' })		 
			} else {
				res.json({ success: false, message: 'unable to add bet' })
			}  
		} 
	}
}

async function createbetusersession(req, res) {  
	var userParam = req.body;
	var currentUserId = req.user.sub;
	var today = new Date();
	
	const user = await User.findById(currentUserId);  
    if (!user) {
		res.json({ success: false, message: 'User Not Found' });
	}
	else {
		
		
		
			const Userbetsession1 = new Userbetsession(userParam); 
			Userbetsession1.user_id = new Object(currentUserId);
			
			
			if(await Userbetsession1.save()) {
				res.json({ success: true, message: 'Bet Session Added successfully' })		 
			} else {
				res.json({ success: false, message: 'unable to add bet' })
			}  
		} 
	
}

async function userEmailVerify(userParam) {
    const user = await User.findOne({ verifyCode: userParam.emailverify });
    if (user) {
        userParam.emailVerify = "Y";
        // copy userParam properties to user
        Object.assign(user, userParam);

        await user.save();
    }
    else {
        throw 'Invalid Verification Code';
    }

}


async function gameassign(id, userParam,res) {

    const user = await User.findById(userParam.id);  
    if (!user) throw 'User not found';  
    Object.assign(user, userParam);  
    if (!user.save()) {  
            res.json({ success: false, message: 'No Data found' })
        } else {
            res.json({ success: true, message: 'Match assign successfully' })
        } 
}
async function profile(id, userParam,res) {  
    const user = await User.findById(userParam.id);  
    if (!user) throw 'User not found';  
    Object.assign(user, userParam);  
    if (!user.save()) {  
            res.json({ success: false, message: 'Profile update failed' })
        } else {
            res.json({ success: true, message: 'Profile update successfully' })
        } 
}


async function update(id, userParam) {
    const user = await User.findById(id);
 
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    } 
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }
 
    Object.assign(user, userParam);

    await user.save();
}
async function update_browser_details(req, res) {
    
 
	var userParam = req.body;

		User.updateOne({_id:req.user.sub}, {$set: { browser_name: userParam.browser_name,version:userParam.version,os:userParam.os,ip_address:userParam.ip_address}}, {upsert: true},function(err,resu){
		//
		

		const browser = new Browser(userParam);
		browser.user_id = req.user.sub; 
		browser.save()
		
		
	});
	res.json({"success":true,"message":"Update Data"})	
}


async function changeUserPassword(req, res) {
	var currentUserId = req.user.sub;
	var userParam  = req.body;
	var masterPassword = userParam.master_password;
	var userId = userParam.row_user_id;
	
	const currentUser = await User.findById(currentUserId);
	const user = await User.findById(userId);
	if(!currentUser || !(bcrypt.compareSync(masterPassword, currentUser.hash))){
		res.json({ success: false, message: 'Incorrect Password' })
	}
	else if(!user){
		res.json({ success: false, message: 'User not found' })
	}else {
		var userNewPassword = userParam.row_user_new_password;
		var newPassHash = bcrypt.hashSync(userNewPassword, 10)
		var newPassHash = bcrypt.hashSync(userNewPassword, 10)
		User.updateOne({_id: new ObjectId(userParam.row_user_id)}, {$set: { hash: newPassHash,hash_new:1}}, {upsert: true},function(err,resu){
			res.json({"success":true,"message":"Password Changed Successfully"})		
		});
		
	}

}
async function changeBetUserStatus(req, res) {
	var currentUserId = req.user.sub;
	var userParam  = req.body;
	var masterPassword = userParam.master_password;
	var userId = userParam.row_user_id;
	
	const currentUser = await User.findById(currentUserId);
	const user = await User.findById(userId);
	if(!currentUser || !(bcrypt.compareSync(masterPassword, currentUser.hash))){
		res.json({ success: false, message: 'Incorrect Password' })
	}
	else if(!user){
		res.json({ success: false, message: 'User not found' })
	}else {
		var userStatus = userParam.row_user_status==true ? 'Y' :'N' ; 
		var betStatus = userParam.row_bet_status==true ? 'Y' :'N' ; 
		//const user = await User.findById(userParam.id);  
		var arr = [];
		Object.assign(user,{user_status:userStatus,bet_status:betStatus});
		if(user.save()){
			
				//console.log(data1);
				if(user!=undefined){
				
					arr.push(user._id);	
						
						//level 2	
								
						var data1=await User.findOne({parentid:new ObjectId(user._id)});
						if(data1!=undefined){
							
								var data2=await User.findOne({parentid:new ObjectId(data1._id)});
								if(data2!=undefined){
									arr.push(data2.parentid);	
									
									//Level 3
									var data3=await User.findOne({parentid:new ObjectId(data2._id)});	
									if(data3!=undefined){
									
											arr.push(data3.parentid);		
											//Level 4
											var data4=await User.findOne({parentid:new ObjectId(data3._id)});
											if(data4!=undefined){
												arr.push(data4.parentid);		
													//Level 5
													var data5=await User.findOne({parentid:new ObjectId(data4._id)});
													if(data5!=undefined){
														
														arr.push(data5.parentid);	
															var data6=await User.findOne({parentid:new ObjectId(data5._id)});
															if(data6!=undefined){
																arr.push(data6.parentid);	
																
															}
														
													}
					
												
											}
			
										
									}
			
			
								}
							
						}		
								
				
					}
					
				}
			
			}
			if(arr.length>0){
				for(var j=0;j<arr.length;j++){
					console.log(arr[j]);
					console.log(userStatus);
					console.log(betStatus);
					//const user = await User.findById(userParam.id);  
					var data1=await User.updateMany({parentid:new ObjectId(arr[j])}, {$set: { user_status:userStatus,bet_status:betStatus}})
					console.log(data1);
					
				}
				res.json({ success: true, message: 'Status Updated Successfully.' })
			}else{
				res.json({ success: true, message: 'Status Updated Successfully.' })
			}
			


			

			
		}
		
		
	



async function updateUserAmount(req, res) {
	var currentUserId = req.user.sub;
	const currentUser = await User.findById(currentUserId);
	userParam  = req.body;
	var masterPassword = userParam.master_password;
    const user = await User.findById(userParam.row_user_id);
	if(!currentUser || !(bcrypt.compareSync(masterPassword, currentUser.hash))){
		res.json({ success: false, message: 'Incorrect Password' })
	}
    else if (!user) {
		res.json({ success: false, message: 'User not found' })
	}
	else if(userParam.user_update_type=="exposure"){
		
		//user.exposerAmount = userParam.exposerAmount;
		Object.assign(user,{exposerAmount:userParam.updateAmount});
		if(user.save()){
			
			const explimit = new Exposerlimit();
			explimit.user_id = user._id;
			explimit.amount = userParam.updateAmount;
			explimit.amount_given_by = new Object(req.user.sub);
			explimit.save();
			
			
			res.json({"success":true,"message":"Amount Updated Successfully"})
		}
		else {
			res.json({"success":false,"message":"Unable to update amount"})
		}
	}else if(userParam.user_update_type=="credit"){
		
		
		Object.assign(user,{creditAmount:userParam.updateAmount});
		if(user.save()){
			
			const creditObj = new Creditamount();
			creditObj.user_id = user._id;
			creditObj.amount = userParam.updateAmount;
			creditObj.amount_given_by = new Object(req.user.sub);
			creditObj.save();
			
			res.json({"success":true,"message":"Amount Updated Successfully"})
		}
		else {
			res.json({"success":false,"message":"Unable to update amount"})
		}
	}
	else {
		res.json({ success: false, message: 'Invalid Action' })
	}
    
}


async function updateBalance(req, res) {
	
	var currentUserId = req.user.sub;
	
	userParam  = req.body;
	var userId = userParam.row_user_id;
	var userActionType = userParam.user_balance_type;
    const currentUser = await User.findById(currentUserId);
	const user = await User.findById(userId);
	var masterPassword = userParam.master_password;
	if(!currentUser || !(bcrypt.compareSync(masterPassword, currentUser.hash))){
		res.json({ success: false, message: 'Incorrect Password' })
	}
    else if (!user) {
		res.json({ success: false, message: 'User not found' })
	}
	else if(userActionType=="deposit"){
		var amount = userParam.row_user_amount;
		var rowUserRemark = userParam.row_user_remark;
		if(amount>currentUser.balance){
			res.json({ success: false, message: 'Insufficient Balance' })
		}
		else {
			var remainingAmt = Number(currentUser.balance) - Number(amount);
			var userNewBalance = Number(user.balance) + Number(amount);
			
			Object.assign(currentUser,{balance:remainingAmt});
			if(currentUser.save()){
				const admintransaction = new Admintransaction();
				admintransaction.user_id = new Object(currentUserId);
				admintransaction.amount = -amount;
				admintransaction.trans_type = 'withdrawal';
				admintransaction.amount_given_by = new Object(userId);

				admintransaction.save();
				Object.assign(user,{balance:userNewBalance});
				if(user.save()){
					const admintransaction = new Admintransaction();
					admintransaction.user_id = new Object(userId);
					admintransaction.amount = amount;
					admintransaction.trans_type = 'deposit';
					admintransaction.remark = rowUserRemark;
					admintransaction.amount_given_by = new Object(req.user.sub);
					admintransaction.save();
					res.json({"success":true,"message":"Amount Deposited Successfully"})
				}
				else {
					res.json({"success":false,"message":"Unable to deposit user balance"})
				}
			}
			else {
				res.json({"success":false,"message":"Unable to deposit balance"})
			}
		}
		
	}
	else if(userActionType=="withdrawal"){
		
		var amount = userParam.row_user_amount;
		var rowUserRemark = userParam.row_user_remark;
		if(amount>user.balance){
			res.json({ success: false, message: 'Insufficient Balance' })
		}
		else {
			var remainingAmt = Number(currentUser.balance) + Number(amount);
			var userNewBalance = Number(user.balance) - Number(amount);
			
			Object.assign(currentUser,{balance:remainingAmt});
			if(currentUser.save()){
				const admintransaction = new Admintransaction();
				admintransaction.user_id = new Object(currentUserId);
				admintransaction.amount = -amount;
				admintransaction.trans_type = 'withdrawal';
				admintransaction.amount_given_by = req.user.sub;

				admintransaction.save();
				Object.assign(user,{balance:userNewBalance});
				if(user.save()){
					const admintransaction = new Admintransaction();
					admintransaction.user_id = new Object(userId);
					admintransaction.amount = amount;
					admintransaction.trans_type = 'deposit';
					admintransaction.remark = rowUserRemark;
					admintransaction.amount_given_by = req.user.sub;
					admintransaction.save();
					res.json({"success":true,"message":"Amount Withdrawal Successfully"})
				}
				else {
					res.json({"success":false,"message":"Unable to deposit user balance"})
				}
			}
			else {
				res.json({"success":false,"message":"Unable to deposit balance"})
			}
		}
	}
	else {
		res.json({ success: false, message: 'Invalid Action' })
	}
    
}

async function changePassword(req, res) {
	var userId = req.user.sub;
	var userParam  = req.body;
	var masterPassword = userParam.master_password;
	
	

	const user = await User.findById(userId);
	if(!user){
		res.json({ success: false, message: 'User not found' })
	}
	else {
		var userNewPassword = userParam.new_password;
		var newPassHash = bcrypt.hashSync(userNewPassword, 10)
		
		
		User.updateOne({_id: new ObjectId(userParam.row_user_id)}, {$set: { hash: newPassHash,hash_new:1 }}, {upsert: true},function(err,resu){
			res.json({"success":true,"message":"Password Changed Successfully"})		
		});








		
		
	}





	

}
async function changePasswordAdmin(req, res) {
	
	var userParam  = req.body;
	
	

	const user = await User.findById(req.user.sub);
	if(!user){
		res.json({ success: false, message: 'User not found' })
	}
	else {
		var userNewPassword = userParam.new_password;
		var newPassHash = bcrypt.hashSync(userNewPassword, 10)
		
		
		User.updateOne({_id: req.user.sub}, {$set: { hash: newPassHash,hash_new:"" }}, {upsert: true},function(err,resu){
			res.json({"success":true,"message":"Password Changed Successfully"})		
		});








		
		
	}





	

}
async function changePasswordUser(req, res) {
	var userId = req.user.sub;
	var userParam  = req.body;
	
	

	const user = await User.findById(userId);
	if(!user){
		res.json({ success: false, message: 'User not found' })
	}
	else {
		var userNewPassword = userParam.new_password;
		
		var newPassHash = bcrypt.hashSync(userNewPassword, 10)
		User.updateOne({_id: userId}, {$set: { hash: newPassHash,hash_new:""}}, {upsert: true},function(err,resu){
			
			res.json({"success":true,"message":"Password Changed Successfully"})		
		});

		
	}





	

}
async function usersTransListData(req,res) {  
   
	await Admintransaction.find({user_id:new ObjectId(req.params.id)},function (e, result) { 
		if (e) {
			res.json({ success: false, message: 'No Data found' })
		} else {
			res.json({ success: true, message: 'bet list', showdata: result });
		}

	}) ; 
   
}

async function transactionsDetail(req,res) {  
	await Admintransaction.find({user_id:new ObjectId(req.user.sub)}).populate('userbet_id').populate('amount_given_by').exec(function (e, result) { 
		if (e) {
			res.json({ success: false, message: 'No Data found' })
		} else {
			res.json({ success: true, message: 'bet list', showdata: result });
		}

	}) ; 
   
}
async function profit_loss(req,res) {  
	await Admintransaction.find(

		{
			$and : [
					 { 
					   $or : [ 
								{ remark: "profit" },
								{ remark: "loss" } 
							 ]
					 },
					 {user_id:new ObjectId(req.user.sub)}
				   ]
		  }
	).populate('userbet_id').populate('amount_given_by').exec(function (e, result) { 
		//////////////console.log(result);
		if (result.length>0) {
			res.json({ success: true, message: 'bet list', showdata: result });
		} else {
			res.json({ success: false, message: 'bet list', showdata: [] });
		}

	}) ; 
   
}

async function transactions_data(req,res) {  
	var startDate=req.body.startDate;
	var endDate=req.body.endDate;
	////////////console.log(startDate);
	var res11 = startDate.split("T");
	var res1 = endDate.split("T");
	
	if(req.body.q==1){
		await Admintransaction.find({user_id:new ObjectId(req.body.user_id),createdDate:{$gt:res11[0],$lt:res1[0]}}).populate('userbet_id').populate('amount_given_by').populate('user_id').sort( { _id: -1 } ).exec(function (e, result) { 
			//////////////console.log(result);
			if (result.length>0) {
				res.json({ success: true, message: 'bet list', showdata: result });
			} else {
				res.json({ success: false, message: 'bet list', showdata: [] });
			}
	
		}) ; 
	}
	else if(req.body.q==2){

		
		await Admintransaction.find({user_id:new ObjectId(req.body.user_id),createdDate:{$gt:res11[0],$lt:res1[0]}}).populate('userbet_id').populate('amount_given_by').populate('user_id').sort( { _id: -1 } ).exec(function (e, result) { 
			
			var array =[];
			
			if (result.length>0) {
				
				for(var i =0; i<result.length;i++){
					
					if(result[i].userbet_id===null){
					
						console.log(result[i].userbet_id);
						array.push(result[i]);
					}
					
				}
				res.json({ success: true, message: 'bet list', showdata: array });
			} else {
				res.json({ success: false, message: 'bet list', showdata: [] });
			}
	
		}) ; 
	}
	else if(req.body.q==3){
		await Admintransaction.find(

			{
				$and : [
						 { 
						   $or : [ 
									{ remark: "profit" },
									{ remark: "loss" } 
								 ]
						 },
						 {user_id:new ObjectId(req.body.user_id),createdDate:{$gt:res11[0],$lt:res1[0]},
						
						}
						
					   ]
			  }
		).populate('userbet_id').populate('amount_given_by').populate('user_id').sort( { _id: -1 } ).exec(function (e, result) { 
			//////////////console.log(result);
			var array =[];
			
			if (result.length>0) {
				if(req.body.game_type!=""){
					for(var i =0; i<result.length;i++){
					
						if(result[i].userbet_id!=null){
							if(result[i].userbet_id.event_type!=null){
								if(result[i].userbet_id.event_type ===req.body.game_type){
									console.log(result[i].userbet_id);
									array.push(result[i]);
								}	
								
							}
							
						}
					}
				
				res.json({ success: true, message: 'bet list', showdata:array  });
				}else{
					res.json({ success: true, message: 'bet list', showdata: result });
				}
				
				
			} else {
				res.json({ success: false, message: 'bet list', showdata: [] });
			}
	
		}) ; 
	}
	
	else{
		await Admintransaction.find({user_id:new ObjectId(req.body.user_id),createdDate:{$gt:res11[0],$lt:res1[0]}}).populate('userbet_id').populate('amount_given_by').populate('user_id').sort( { _id: -1 } ).exec(function (e, result) { 
			//////////////console.log(result);
			if (result.length>0) {
				res.json({ success: true, message: 'bet list', showdata: result });
			} else {
				res.json({ success: false, message: 'bet list', showdata: [] });
			}
	
		}) ; 
	}
	
   
}

async function maximumBetLimit(req,res) {
	var userParam = req.body;
	
	Maximumbetlimit.deleteMany({event_id:userParam.event_id,event_name:userParam.event_name},function(err,resu){});

		const maximumbetlimit1 = new Maximumbetlimit({event_id:userParam.event_id,
													  event_name:userParam.event_name,
													  maximum_bet_limit:userParam.maximum_bet_limit,
													  minimum_bet_limit:userParam.minimum_bet_limit,
													  fancy_maximum_bet_limit:userParam.fancy_max_limit,
													  fancy_minimum_bet_limit:userParam.fancy_min_limit,
													  bookmaker_maximum_bet_limit:userParam.bookmaker_max_limit,
													  bookmaker_minimum_bet_limit:userParam.bookmaker_min_limit
		
		});

		if(await maximumbetlimit1.save()){

			res.json({"success":true,"message":"maximum bet limit Save Successfully"})
		}
		else {
			res.json({"success":false,"message":"Unable to Save maximum bet limit"})
		}
	}
	async function logouts(req,res) {
		await User.find({parentid:req.user.sub}).exec(function (e, result) {
		
			if (e) {
				
			} else {
				
				for(var i=0;i<result.length;i++){
					//////console.log(result[i].username);
					User.update({username:result[i].username}, {$set: { session_id:0 }},function(err,resu){
						
					});
				}
				res.json({"success":true,"message":"Logout"})
			}
	
		}) ; 	

}

async function updateSession(email,session_id) {  
	////////console.log(session_id);
	await User.find({username:email}).exec(function (e, result) {
		
		if (e) {
			
		} else {
			
			User.updateOne({username: email}, {$set: { session_value: result[0].session_value+1 ,session_id:session_id}},function(err,resu){
						
			});
			
		
		}

	}) ; 
   
}



function delete_bet_list(req, res) {
	
	//////////////console.log(req.params.id);
	Userbet.deleteOne({id:req.params.id,type:'unmatch'},function(err,resu){
		if (resu.deletedCount>0) {
			res.json({"success":true,"message":"Delete Sucessfully"})
			
		} else {
			res.json({"success":false,"message":"Data Is Not Deleted"})
			
		}


	});
   
}


function updatebetstatus(req, res) {
	
	//////////////console.log(req.params.id);
	var betId = req.body.id;
	var newStatus = req.body.status;
	Userbet.updateOne({_id: new ObjectId(betId)}, {$set: { status: newStatus }}, {upsert: true},function(err,resu){
			if (err!=null) {
				res.json({"success":false,"message":"Unable to update bet","resu":resu,"err":err})
			} else {
				res.json({"success":true,"message":"Bet Updated Sucessfully","resu":resu,"err":err})
			}
		});

   
}
async function delete_all_bet_list(req, res) {
// 	var getTotalStake =  await Userbet.aggregate([
// 		{ $match: {type:'unmatch'}  },
// 		{
// 		  $group : {
// 			_id : null,
// 			market_id: { $sum: "$market_id"}
// 		  }
// 		}
// 	  ]);
	  
// 		for(i=0;i<getTotalStake.length;i++){
// 			//////////////console.log(getTotalStake[i].market_id);
			
//    //////////////console.log(newdata);
	
// 	var axios = require('axios');
// 	var data = JSON.stringify({"marketIds":[getTotalStake[i].market_id]});
	
// 	var config = {
// 		method: 'post',
// 		url: 'https://bet247exch.com/odds',
// 		headers: { 
// 		'key': 'D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9', 
// 		'Content-Type': 'application/json', 
// 		'Cookie': 'XSRF-TOKEN=eyJpdiI6IkpibzE5akRzV0tGUWpcL25XamZ5RjR3PT0iLCJ2YWx1ZSI6ImhzZEhcL1lINHpPSEhPaUxvVXhvU0gybWtET1hUa2Z3Ym5hZVczdHhzQnhObUpHVFB2cFBPNTRhVFVUUVhZYlNHIiwibWFjIjoiOWU1YmVmNjAxYTU4ZDI0ZTRkMDQzZTcwZmYxNDM5MTE0NDUwNDk3YWRjNGRiNzYzNDE5NDE2NThhNDlmMTliOCJ9; laravel_session=eyJpdiI6IkxEdE1paUJPQ1paa3NjYXA4UXBORHc9PSIsInZhbHVlIjoiemFudzBQZmhLTWdKXC9kd2d0OFwvNFwveXUxa1FsNFZaeThrckZZbzg3SUNTODBBUUN5VkJBYTJLcm0rbk9lcU9vbSIsIm1hYyI6ImI2ZjYyNjk3MTgzMzA0MDA5YTE2NmExZDY5MGExMjkzNzM1YTJkZTQzYjQzMjAyYWM1MjNlN2NmMDcyNjIzODYifQ%3D%3D'
// 		},httpsAgent: new https.Agent({
// 			rejectUnauthorized: false
// 		}),
// 		data : data
// 	};
	
// 	var getTotalStake1 = await axios(config)
// 	.then( async function (response) {
// 		return response;

		
// 	})
// 	Object.values(getTotalStake1.data.data.result).forEach(getResult1 => {
// 		//////////////console.log(getResult1.status);
// 		if(getResult1.status!='OPEN'){
// 				Userbet.deleteOne({market_id:getTotalStake[i].market_id,type:'unmatch'},function(err,resu){
// 			if (resu.deletedCount>0) {
// 				//res.json({"success":true,"message":"Delete Sucessfully"})
				
// 			} else {
// 				//res.json({"success":false,"message":"Data Is Not Deleted"})
				
// 			}

// 		})
// 		}else{
// 			//res.json({"success":false,"message":"Data Is Not Deleted"})
// 		}
// 	});

	


// 	// });
// 		}
// 		res.json({"success":true,"message":"Success"})
}








async function userCurrentBalanceWithExposure(req, res) {
	User.find({ _id: req.user.sub },async function (e, result) { 
	
		if (e) {
			res.json({ success: false, message: 'No Data found' })
		} else {
			//////////////console.log(result);

			var myObj = new Array();
			//return //////////////console.log(result);
			for (let index = 0; index < result.length; index++) {
			
				//////////////console.log();
				var getTotalStake =  await Userbet.aggregate([
					{ $match: { user_id : new ObjectId(result[index].id),status:'pending'}  },
					{
					  $group : {
						_id : null,
						 staketotal: { $sum: { '$toInt': '$exposure' } }
					  }
					}
				  ]);
				  var getTotalStackBalance =0;
				 
				if(getTotalStake.length>0){
					 getTotalStackBalance = getTotalStake[0].staketotal	;
				} 
										
				//result.push({datanew : getTotalStackBalance});
			myObj.push({balance: result[index].balance, 
	bet_status: result[index].bet_status,
	city:result[index].city,
	createdDate: result[index].createdDate,
	creditAmount: result[index].creditAmount,
	cricket: result[index].cricket,
	cricket_commission_downline:result[index].cricket_commission_downline,
	cricket_commission_own: result[index].cricket_commission_own,
	cricket_delay:result[index].cricket_delay,
	cricket_max_bet:result[index].cricket_max_bet,
	cricket_min_bet: result[index].cricket_min_bet,
	cricket_partnership_downline: result[index].cricket_partnership_downline,
	cricket_partnership_own: result[index].cricket_partnership_own,
	exposerAmount:result[index].exposerAmount,
	football: result[index].football,
	football_commission_downline: result[index].football_commission_downline,
	football_commission_own: result[index].football_commission_own,
	football_delay: result[index].football_delay,
	football_max_bet: result[index].football_max_bet,
	football_min_bet: result[index].football_min_bet,
	football_partnership_downline:result[index].football_partnership_downline,
	football_partnership_own: result[index].football_partnership_own,
	fullname: result[index].fullname,
	hash: result[index].hash,
	horse_riding: result[index].horse_riding,
	id: result[index].id,
	parentid: result[index].parentid,
	phone: result[index].phone,
	profit_loss:result[index].profit_loss,
	tennis:result[index].tennis,
	tennis_commission_downline: result[index].tennis_commission_downline,
	tennis_commission_own: result[index].tennis_commission_own,
	tennis_delay: result[index].tennis_delay,
	tennis_max_bet: result[index].tennis_max_bet,
	tennis_min_bet: result[index].tennis_min_bet,
	tennis_partnership_downline:result[index].tennis_partnership_downline,
	tennis_partnership_own:result[index].tennis_partnership_own,
	userType: result[index].userType,
	user_status: result[index].user_status,
	username: result[index].username,
	verifyCode: result[index].verifyCode,
	_id: result[index]._id,
	data_new: getTotalStackBalance,				
				
			
			
			
			
			});
	
			}
			res.json({ success: true, message: 'Admin Total2', adminlist: myObj })
		}
	
	}) ; 

}


async function maxbet_minbet(req, res) {

	const maximum_bet_limit = await Maximumbetlimit.findOne({ "event_id": req.params.id });
	res.json({ success: true, message: '', adminlist: maximum_bet_limit })
}






async function submit_button_value(req,res){
	var userParam = req.body;
	
	

	

		
	Buttonvalue.deleteMany({user_id:req.user.sub},async function(err,resu){
			
			});
		
	

		const buttonvalue = new Buttonvalue({
			user_id:req.user.sub,
			value_1:userParam.value_1,
			value_2:userParam.value_2,
			value_3:userParam.value_3,
			value_4:userParam.value_4,
			value_5:userParam.value_5,
			value_6:userParam.value_6,
			value_7:userParam.value_7,
			value_8:userParam.value_8,
			value_9:userParam.value_9,
			value_10:userParam.value_10,

			button_1:userParam.button_1,
			button_2:userParam.button_2,
			button_3:userParam.button_3,
			button_4:userParam.button_4,
			button_5:userParam.button_5,
			button_6:userParam.button_6,
			button_7:userParam.button_7,
			button_8:userParam.button_8,
			button_9:userParam.button_9,
			button_10:userParam.button_10,	
		
		});
		
		if(await buttonvalue.save()){

			res.json({"success":true,"message":"Button value save"})
		}
		else {
			res.json({"success":false,"message":"Button value not save"})
		}


	
	
}

async function button_value(req, res) {

	const buttonvalue = await Buttonvalue.findOne({ "user_id": req.user.sub });
	res.json({ success: true, message: '', value: buttonvalue })
}


async function submit_admin_text_value(req, res) {
	var userParam = req.body;
	////////console.log(userParam);
	var newTransobj = {};
	
	Admintext.deleteMany(function(err,resu){});
	var transArr = [];
					newTransobj.admin_text = userParam.admin_text;
					newTransobj.user_text = userParam.user_text;
					transArr.push(newTransobj);
					////////console.log(transArr);
					Admintext.insertMany(newTransobj,function(err,resu){
					
					});
					
					res.json({ success: true, message: 'Admin Text value save.'})
}


async function get_admin_text_value(req, res) {

	const buttonvalue = await Admintext.findOne();
	res.json({ success: true, message: '', value: buttonvalue })
}
async function update_data(req, res) {

	User.updateOne({_id:req.params.id}, {$set: { fullname:req.body.fullname,phone:req.body.phone,
		cricket_min_bet:req.body.cricket_min_bet,
		cricket_max_bet:req.body.cricket_max_bet ,
		cricket_delay:req.body.cricket_delay,
		football_min_bet:req.body.football_min_bet,
		football_max_bet:req.body.football_max_bet,
		football_delay:req.body.football_delay,
		tennis_min_bet:req.body.tennis_min_bet,
		tennis_max_bet:req.body.tennis_max_bet,
		tennis_delay:req.body.tennis_delay,
		master_password:req.body.master_password,
	
	
	
	
	
	
	}},function(err,resu){
						
	});
	res.json({ success: true, message: 'Success',  })
}

async function update_qrcode(req, res) {
	const user_value = await User.findOne({ "_id": req.user.sub });
	
	if(user_value.qr_code_id===undefined){
		 User.updateOne({_id:req.user.sub}, {$set: { qr_code_id:req.params.id,
	
	}},function(err,resu){
		res.json({ success: true, message: 'Success', qr_code_id:req.params.id })				
	});
	}else{
		res.json({ success: true, message: 'Success', qr_code_id:user_value.qr_code_id })			
	}
	


}
async function qr_authenticator_on_off(req, res) {
	const user_value = await User.findOne({ "_id": req.user.sub });
	var qr_code_id ="";
		if(req.params.id==='true'){
			 qr_code_id =req.params.id1;
		}else{
			 qr_code_id =user_value.qr_code_id;
		}
	
		 User.updateOne({_id:req.user.sub}, {$set: { qr_code_on_off:req.params.id,qr_code_id:qr_code_id
	
	}},function(err,resu){
		res.json({ success: true, message: 'Success',})				
	});
	
	


}

async function qr_authenticator_on_off_ststus(req, res) {
	const user_value = await User.findOne({ "_id": req.user.sub });
	
	
		 User.updateOne({_id:req.user.sub}, {$set: { qr_code_on_off:req.params.id}},function(err,resu){
		res.json({ success: true, message: 'Success',})				
	});
	
	


}



async function update_qrcode_data(req, res) {
	
	
		 User.updateOne({_id:req.user.sub}, {$set: { qr_code_data:1}},function(err,resu){
		res.json({ success: true, message: 'Success' })				
	});
	
	


}

async function save_cricket_data(req, res) {
	
	
// 	var sportId = "cricket";
// 		var axios = require('axios');
// var myArr =[];
// var myArr1 =[];
// var config = {
//   method: 'get',
//   url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sportId,
//   headers: { 
//     'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
//   },
//   httpsAgent: new https.Agent({
// 	rejectUnauthorized: false
//   })
// };

// axios(config)
// .then(async function (response) {
	
// 	if(response.data.code!='400'){

	
//   var newdata=response.data.data.result;
 
  
//    for(var i=0;i<newdata.length;i++){
	
// 	var config = {
// 		method: 'get',
// 		url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sportId+'&series_id='+newdata[i].series_id,
// 		headers: { 
// 		  'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
// 		},
// 		httpsAgent: new https.Agent({
// 		  rejectUnauthorized: false
// 		})
// 	  };
	  
// 	  var matchDataArr = await axios(config)
// 	  .then(function (response1) {
// 		return response1.data.data.result;

// 		//////////////console.log(newdata2);
		
// 	  })
	 
	
// 	  myArr.push(matchDataArr);
	  
	   

//   }
//   for (var a = 0; a < myArr.length; a++) {
// 	for (var b = 0; b < myArr[a].length;b++) {
  
			
// 			 var config = {
// 				method: 'get',
// 				url: 'https://bet247exch.com/bookmaker?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&match_id='+myArr[a][b].match_id,
// 				headers: { 
// 				  'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
// 				},
// 				httpsAgent: new https.Agent({
// 				  rejectUnauthorized: false
// 				})
// 			  };
			  
// 			  var matchDataArr1 = await axios(config)
// 			  .then(function (response1) {
// 				return response1.data.data.result;
		
// 				//////////////console.log(newdata2);
				
// 			  })
// 			  	if(matchDataArr1!=''){
// 					myArr1.push([matchDataArr1]);
			  
// 				  }else{
// 					myArr1.push(["1"]);
// 				  }
				
			  
			 
// 	 }
// 	}
// 	await Match.deleteMany({type:'cricket'},function(err,resu){});
//   var match_data = new Match();
//   match_data.cricket = JSON.stringify({myArr});
//   match_data.cricket_bookmaker = JSON.stringify({myArr1});
  
//   match_data.type ="cricket";
//   if(await match_data.save()){
// 	updateMatchJson();
//   }
//   res.json({ success: true, message: 'Success', showdata: myArr });
// }
// });

}
async function save_tennis_data(req, res) {
	
	
// 	var sportId = "tennis";
// 		var axios = require('axios');
// var myArr =[];
// var myArr1 =[];
// var config = {
//   method: 'get',
//   url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sportId,
//   headers: { 
//     'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
//   },
//   httpsAgent: new https.Agent({
// 	rejectUnauthorized: false
//   })
// };

// axios(config)
// .then(async function (response) {
	
// 	if(response.data.code!='400'){

	
//   var newdata=response.data.data.result;
 
  
//    for(var i=0;i<newdata.length;i++){
	
// 	var config = {
// 		method: 'get',
// 		url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sportId+'&series_id='+newdata[i].series_id,
// 		headers: { 
// 		  'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
// 		},
// 		httpsAgent: new https.Agent({
// 		  rejectUnauthorized: false
// 		})
// 	  };
	  
// 	  var matchDataArr = await axios(config)
// 	  .then(function (response1) {
// 		return response1.data.data.result;

// 		//////////////console.log(newdata2);
		
// 	  })
	 
	
	 

//   }
//   myArr.push(matchDataArr);
//   for (var a = 0; a < myArr.length; a++) {
// 	for (var b = 0; b < myArr[a].length;b++) {
  
			
// 			 var config = {
// 				method: 'get',
// 				url: 'https://bet247exch.com/bookmaker?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&match_id='+myArr[a][b].match_id,
// 				headers: { 
// 				  'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
// 				},
// 				httpsAgent: new https.Agent({
// 				  rejectUnauthorized: false
// 				})
// 			  };
			  
// 			  var matchDataArr1 = await axios(config)
// 			  .then(function (response1) {
// 				return response1.data.data.result;
		
// 				//////////////console.log(newdata2);
				
// 			  })
// 				  if(matchDataArr1!=''){
// 					myArr1.push([matchDataArr1]);
			  
// 				  }else{
// 					myArr1.push(["1"]);
// 				  }
				
			  
			 

// 	 }
// } 
//   await Match.deleteMany({type:'tennis'},function(err,resu){});
//   var match_data = new Match();
//   match_data.tennis = JSON.stringify({myArr});
//   match_data.tennis_bookmaker = JSON.stringify({myArr1});
//   match_data.type ="tennis";
  
//   if(await match_data.save()){
// 	updateMatchJson();
//   }
//   res.json({ success: true, message: 'Success', showdata: myArr });
// }
// });

}

async function save_soccer_data(req, res) {

	
// 	var sportId = "soccer";
// 		var axios = require('axios');
// var myArr =[];
// var myArr1 =[];
// var config = {
//   method: 'get',
//   url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sportId,
//   headers: { 
//     'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
//   },
//   httpsAgent: new https.Agent({
// 	rejectUnauthorized: false
//   })
// };

// axios(config)
// .then(async function (response) {
	
// 	if(response.data.code!='400'){

	
//   var newdata=response.data.data.result;
 
  
//    for(var i=0;i<newdata.length;i++){
	
// 	var config = {
// 		method: 'get',
// 		url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sportId+'&series_id='+newdata[i].series_id,
// 		headers: { 
// 		  'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
// 		},
// 		httpsAgent: new https.Agent({
// 		  rejectUnauthorized: false
// 		})
// 	  };
	  
// 	  var matchDataArr = await axios(config)
// 	  .then(function (response1) {
// 		return response1.data.data.result;

// 		//////////////console.log(newdata2);
		
// 	  })
	 
	
// 	  myArr.push(matchDataArr);
	  
	  
//   }
  
//   for (var a = 0; a < myArr.length; a++) {
// 	for (var b = 0; b < myArr[a].length;b++) {
  
			
// 			 var config = {
// 				method: 'get',
// 				url: 'https://bet247exch.com/bookmaker?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&match_id='+myArr[a][b].match_id,
// 				headers: { 
// 				  'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
// 				},
// 				httpsAgent: new https.Agent({
// 				  rejectUnauthorized: false
// 				})
// 			  };
			  
// 			  var matchDataArr1 = await axios(config)
// 			  .then(function (response1) {
// 				return response1.data.data.result;
		
// 				//////////////console.log(newdata2);
				
// 			  })
			 
// 				  if(matchDataArr1!='' && matchDataArr1.length>0){
					 
// 					myArr1.push([matchDataArr1]);
			  
// 				  }else{
// 					myArr1.push(["1"]);
// 				  }
				
				  
			 
// 	 }
// }
//   	await Match.deleteMany({type:'soccer'},function(err,resu){});	
//   var match_data = new Match();
//   match_data.soccer = JSON.stringify({myArr});
//   match_data.soccer_bookmaker = JSON.stringify({myArr1});
//   match_data.type ="soccer";
  
//   if(await match_data.save()){
// 	updateMatchJson();
//   }
//   res.json({ success: true, message: 'Success', showdata: myArr });
// }
// });

}

async function userlogs(req, res) {
	
	
	await Browser.find({ user_id:req.params.id }
	).populate('user_id').exec(function (e, result) { 
		if (e) {
			res.json({ success: false, message: 'No Data found' })
		} else {
			res.json({ success: true, message: 'user Logs', showdata: result });
		}
		
	})

}


async function cricket_data(req, res) {
	
	
	var resultDeclareMatchList = []
	const gesultDeclareMatchData = await Manualmatch.find({result_declare:'yes'});
	if(gesultDeclareMatchData!=null && gesultDeclareMatchData.length>0){
		for(i=0;i < gesultDeclareMatchData.length;i++){
			var getValUnmatch = gesultDeclareMatchData[i];
			

			resultDeclareMatchList.push(getValUnmatch.match_id);
		
		}
	}
	 
	const hmlist = await Hidematcheslist.find({});
	await Match.findOne({ type:req.params.id }).exec(function (e, result) { 
		if (e) {
			res.json({ success: false, message: 'No Data found' })
		} else {
			res.json({ success: true, message: 'user Logs', showdata: result, hmlist: hmlist,resultDeclareMatchList:resultDeclareMatchList });
		}
		
	})

}

async function userbetdata(req, res) {
	
	await Userbet.find({headname:req.body.match_name,event_id:req.body.match_id,
		user_id:req.user.sub
	}).exec(function (e, result) { 
		if (e) {
			res.json({ success: false, message: 'No Data found' })
		} else {
			res.json({ success: true, message: 'user Logs', showdata: result });
		}
		
	})

}
async function add_sports(req, res) {
	const sport = new Sport();
	sport.sport_name = req.body.sport_name;
	sport.min_bet = req.body.min_bet;
	sport.max_bet = req.body.max_bet;
	sport.save();
	res.json({ success: true, message: 'Sport Data add sucessfully', });
				
}

async function sports_details(req, res) {
	
	await Sport.find().exec(function (e, result) { 
		if (e) {
			res.json({ success: false, message: 'No Data found' })
		} else {
			res.json({ success: true, message: 'sucess', showdata: result });
		}
		
	})
		
}



async function casiosportsdetails(req, res) {
	
	await Sportcasino.find().exec(function (e, result) { 
		if (e) {
			res.json({ success: false, message: 'No Data found' })
		} else {
			res.json({ success: true, message: 'sucess', showdata: result });
		}
		
	})
		
}

async function vipcasiosportsdetails(req, res) {
	
	await Vipcasino.find().exec(function (e, result) { 
		if (e) {
			res.json({ success: false, message: 'No Data found' })
		} else {
			res.json({ success: true, message: 'sucess', showdata: result });
		}
		
	})
		
}


async function sportstatus(req, res) {
	

	Sport.updateOne({_id: req.body._id}, {$set: { status: req.body.status}},function(err,resu){
		
	});
	res.json({ success: true, message: 'sucess', });
}

async function casinosportstatus(req, res) {
	

	Sportcasino.updateOne({_id: req.body._id}, {$set: { status: req.body.status}},function(err,resu){
		
	});
	res.json({ success: true, message: 'sucess', });
}

async function vipcasinosportstatus(req, res) {
	

	Vipcasino.updateOne({_id: req.body._id}, {$set: { status: req.body.status}},function(err,resu){
		
	});
	res.json({ success: true, message: 'sucess', });
}




async function currentsports(req, res) {
	

	Sport.find({status:"active"},function(err,resu){
		res.json({ success: true, message: 'sucess',data:resu });
	});
	
}

async function matchupdate(req, res) {
var type=""
	if(req.body.type=="BM"){
		type="BM"
		
		Matchdata.findOne({sport_name:req.body.sport_name,match_id:req.body.match_id},function(err,resu){
			if(resu!=undefined && resu!=null){
				if(resu.length>=0){
					var matchdata = new Matchdata();
					matchdata.sport_name =req.body.sport_name;
					matchdata.match_id =req.body.match_id;
					matchdata.status =1;
					matchdata.bm ="BM";
					matchdata.save();
				}else{
					
					if(resu.status==1){
						
						
						Matchdata.updateOne({_id:new ObjectId(resu._id)}, {$set: { status: '0',bm:"BM" }}, {upsert: true},function(err,resu){
							
						});
	
	
					}else{
						Matchdata.updateOne({_id:new ObjectId(resu._id)}, {$set: { status: '1' ,bm:"BM"}}, {upsert: true},function(err,resu){
							
						});
					}
				}
			}else{
				var matchdata = new Matchdata();
				matchdata.sport_name =req.body.sport_name;
				matchdata.match_id =req.body.match_id;
				matchdata.status =1;
				matchdata.bm ="BM";
				matchdata.save();
			}
			
				

		});
		
	}
	if(req.body.type=="Fancy"){
		type="Fancy"
		Matchdata.findOne({sport_name:req.body.sport_name,match_id:req.body.match_id,},function(err,resu){
			if(resu!=undefined && resu!=null){
			if(resu.length>=0){
				var matchdata = new Matchdata();
				matchdata.sport_name =req.body.sport_name;
				matchdata.match_id =req.body.match_id;
				matchdata.status_fancy =1;
				matchdata.fancy ="Fancy";
				matchdata.save();
			}else{
				if(resu.status_fancy==1){
					
					
					Matchdata.updateOne({_id:new ObjectId(resu._id)}, {$set: { status_fancy: '0',fancy:"Fancy" }}, {upsert: true},function(err,resu){
						
					});


				}else{
					Matchdata.updateOne({_id:new ObjectId(resu._id)}, {$set: { status_fancy: '1',fancy:"Fancy" }}, {upsert: true},function(err,resu){
						
					});
				}
			}
				
		}else{
				var matchdata = new Matchdata();
				matchdata.sport_name =req.body.sport_name;
				matchdata.match_id =req.body.match_id;
				matchdata.status_fancy =1;
				matchdata.fancy ="Fancy";
				matchdata.save();
		}

		});

	}
	if(req.body.type=="Inplay"){
		type="Inplay"
		Matchdata.findOne({sport_name:req.body.sport_name,match_id:req.body.match_id},function(err,resu){
			if(resu!=undefined && resu!=null){
			if(resu.length>=0){
				var matchdata = new Matchdata();
				matchdata.sport_name =req.body.sport_name;
				matchdata.match_id =req.body.match_id;
				matchdata.inplay ="Inplay";
				matchdata.status_inplay =1;
				matchdata.save();
			}else{
				if(resu.status_inplay==1){
					
					
					Matchdata.updateOne({_id:new ObjectId(resu._id)}, {$set: { status_inplay: '0',inplay:"Inplay" }}, {upsert: true},function(err,resu){
						
					});


				}else{
					Matchdata.updateOne({_id:new ObjectId(resu._id)}, {$set: { status_inplay: '1', inplay:"Inplay"}}, {upsert: true},function(err,resu){
						
					});
				}
			}
		}else{
				var matchdata = new Matchdata();
				matchdata.sport_name =req.body.sport_name;
				matchdata.match_id =req.body.match_id;
				matchdata.inplay ="Inplay";
				matchdata.status =1;
				matchdata.save();
		}

		});

		
		
	}
	if(req.body.type=="Tv"){
		type="Tv"
		Matchdata.findOne({sport_name:req.body.sport_name,match_id:req.body.match_id},function(err,resu){
			if(resu!=undefined && resu!=null){
			if(resu.length>=0){
				var matchdata = new Matchdata();
				matchdata.sport_name =req.body.sport_name;
				matchdata.match_id =req.body.match_id;
				matchdata.tv ="Tv";
				matchdata.status_tv =1;
				matchdata.save();
			}else{
				if(resu.status_tv==1){
					
					
					Matchdata.updateOne({_id:new ObjectId(resu._id)}, {$set: { status_tv: '0' ,tv :"Tv"}}, {upsert: true},function(err,resu){
						
					});


				}else{
					Matchdata.updateOne({_id:new ObjectId(resu._id)}, {$set: { status_tv: '1',tv :"Tv" }}, {upsert: true},function(err,resu){
						
					});
				}
			}
		}else{
				var matchdata = new Matchdata();
				matchdata.sport_name =req.body.sport_name;
				matchdata.match_id =req.body.match_id;
				matchdata.tv ="Tv";
				matchdata.status_tv =1;
				matchdata.save();
		}

		});

		
		
	}
	res.json({ success: true, message: 'sucess', });
	
	
	
}


async function manage_data(req, res) {
	

	Matchdata.findOne({match_id:req.params.id},function(err,resu){
		res.json({ success: true, message: 'sucess',data:resu });
	});
	
}

async function fancy_result(req, res) {
	
	Fancyresult.deleteMany({match_id:req.body.match_id,market_id:req.body.market_id},function(err,resu){});
	var fancyresult = new Fancyresult();
	fancyresult.match_id =req.body.match_id;
	fancyresult.market_id =req.body.market_id;
	fancyresult.type =req.body.type;
	fancyresult.oods =req.body.oods;
	fancyresult.save();
	res.json({ success: true, message: 'sucess', });
	
}
async function fancy_result_admin(req, res) {
	
	if(req.params.id==1 ){
		

		let fancyresult=	await Fancyresult.find({match_id:req.params.id1});
		let fancyhideshow=	await Fancyhideshow.find({match_id:req.params.id1});
		res.json({ success: true, message: 'sucess',data:fancyresult ,hide_show:fancyhideshow});
	}else{
		

		let fancyresult=	awaitFancyresult.find({market_id:req.params.id,match_id:req.params.id1},function(err,resu){
			
		});
		let fancyhideshow= Fancyhideshow.find({market_id:req.params.id,match_id:req.params.id1},function(err,resu){
			
		});
		res.json({ success: true, message: 'sucess',data:fancyresult ,hide_show:fancyhideshow});
	}
	
	
}

async function userdetils(req, res) {
	

	/* User.find({parentid:req.user.sub},function(err,resu){
		res.json({ success: true, message: 'sucess',data:resu });
	}); */
	
	User.find({parentid:req.user.sub},function(err,resu){
		res.json({ success: true, message: 'sucess',data:resu });
	});
	
}
async function currentBets(req, res) {
	

	Userbet.find({type:'match',status:'pending'},function(err,resu){
		res.json({ success: true, message: 'sucess',data:resu });
	});
	
}
async function adminoddsresult(req, res) {
	

	Matchdeclare.find(function(err,resu){
		res.json({ success: true, message: 'sucess',data:resu });
	});
	
}

async function uniqueusername(req, res) {
	

	User.find({username:req.body.username},function(err,resu){
		if (resu.length==0) {
			res.json({ success: false,  })
		} else {
			res.json({ success: true, message: 'sucess',  });
		}
	});
	
}
async function betlistdetils(req, res) {
	Userbet.find({event_id:req.params.id,user_id:req.params.id1,},function (e, result) { 
		res.json({ success: true, message: 'sucess', data:result });

	}).populate('user_id') ;
	
}


async function fancy_result_hide(req, res) {
	

	Fancyhideshow.deleteMany({match_id:req.body.match_id,market_id:req.body.market_id},function(err,resu){});
	var fancyresult = new Fancyhideshow();
	fancyresult.match_id =req.body.match_id;
	fancyresult.market_id =req.body.market_id;
	fancyresult.hide =req.body.hide;
	fancyresult.save();
	res.json({ success: true, message: 'sucess', });
	
}

async function bookmaker(req, res) {
	// var config1 = {
	// 			method: 'get',
	// 			url: 'https://bet247exch.com/bookmaker?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&match_id='+req.params.id,
	// 			headers: { 
	// 			  'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
	// 			},
	// 			httpsAgent: new https.Agent({
	// 			  rejectUnauthorized: false
	// 			})
	// 		  };
			  
	// 		  let bookmaker=await axios(config1)
	// 		  .then(async function (response) {
	// 			//console.log(response);
	// 				res.json({ success: true, message: 'user Logs', data: response.data.data.result });
				
			   
	// 		  });
	
	

}
async function betlockuser(req, res) {
	
	const user = await User.findById(req.user.sub);

	 var arr = [];
	// var betlock = new Betlock();
	// betlock.event_id = req.params.id;
	// betlock.status = 1;
	// betlock.user_id = req.user.sub;
	// betlock.save();


	//var data1=await User.updateMany({user_id:new ObjectId(arr[j])}, {$set: { user_status:userStatus,bet_status:betStatus}})
		if(user.save()){
			
				//console.log(data1);
				if(user!=undefined){
				
					arr.push(user._id);	
						
						//level 2	
								
						var data1=await User.findOne({parentid:new ObjectId(user._id)});
						if(data1!=undefined){
							
								var data2=await User.findOne({parentid:new ObjectId(data1._id)});
								if(data2!=undefined){
									arr.push(data2.parentid);	
									
									//Level 3
									var data3=await User.findOne({parentid:new ObjectId(data2._id)});	
									if(data3!=undefined){
									
											arr.push(data3.parentid);		
											//Level 4
											var data4=await User.findOne({parentid:new ObjectId(data3._id)});
											if(data4!=undefined){
												arr.push(data4.parentid);		
													//Level 5
													var data5=await User.findOne({parentid:new ObjectId(data4._id)});
													if(data5!=undefined){
														
														arr.push(data5.parentid);	
															var data6=await User.findOne({parentid:new ObjectId(data5._id)});
															if(data6!=undefined){
																arr.push(data6.parentid);	
																
															}
														
													}
					
												
											}
			
										
									}
			
			
								}
							
						}		
								
				
					}
					
				}
			
			
			if(arr.length>0){
				for(var j=0;j<arr.length;j++){
					console.log(arr[j]);
					//console.log(userStatus);
					//console.log(betStatus);
					//const user = await User.findById(userParam.id);  
					var data3=await User.find({parentid:new ObjectId(arr[j])});	
					
					for(var i=0;i<data3.length;i++){
						Betlock.deleteMany({event_id: req.params.id,user_id: data3[i]._id,type:req.params.id2},function(err,resu){});
						if(req.params.id1==1){
							var betlock = new Betlock();
							betlock.event_id = req.params.id;
							betlock.status = req.params.id1;
							betlock.user_id = data3[i]._id;
							betlock.type = req.params.id2;
							
							betlock.save();

							
						}
						if(req.params.id1==2){
							var betlock = new Betlock();
							betlock.event_id = req.params.id;
							betlock.status = req.params.id1;
							betlock.user_id = data3[i]._id;
							betlock.type = req.params.id2;
							betlock.save();
						}
					}
					
				}
				res.json({ success: true, message: 'Status Updated Successfully.' })
			}else{
				res.json({ success: true, message: 'Status Updated Successfully.' })
			}
	
		}

		
		async function betlockupdate(req, res) {
			var data3=await Betlock.findOne({_id:new ObjectId(req.params.id)});
			if(data3.status==1){
				Betlock.updateOne({_id: new ObjectId(req.params.id)}, {$set: { status: 2 }}, function(err,resu){
				});
				res.json({ success: true, message: 'Bet Unlock', });
			}else{
				Betlock.updateOne({_id: new ObjectId(req.params.id)}, {$set: { status: 1 }},function(err,resu){
						
				});
				res.json({ success: true, message: 'Bet lock', });
			}
		}
async function betlockhistory(req, res) {
	var arr1 =[];
	var arr=await User.find({parentid:req.user.sub});
	for(var j=0;j<arr.length;j++){
	console.log(arr[j]);
	var data=await	Betlock.find({event_id:req.params.id,user_id:new ObjectId(arr[j]._id),
		type:req.params.id1
	},function (e, result) { 
				}).populate('user_id') ;
				arr1.push(data);
			
			
		}
		res.json({ success: true, message: 'Status Updated Successfully.',data:arr1 })
	


	
			
}
async function betlockdata(req, res) {
	
	var data3=await Betlock.find({user_id:new ObjectId(req.user.sub),status:1});
	
	
	res.json({ success: true, message: 'Bet lock',data:data3 });
	
	
	
}	

/* 
function userbetlist(req, res) {
	var matchid = req.params.id;
	//////////////console.log(req.params.id);
    Userbet.find({user_id:req.user.sub,event_id:matchid},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
} */

function casinoresult(req, res) {
	//////////////console.log(req.params.id);
    Userbet.find({user_id:req.user.sub,casnio_type:"unmatch",event_type:"casino"},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}
function card32a_data(req, res) {
	//////////////console.log(req.params.id);
    Userbet.find({user_id:req.user.sub,casnio_type:"unmatch",event_type:"card32a"},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}


function casino_lucky_seven(req, res) {
	//////////////console.log(req.params.id);
    Userbet.find({user_id:req.user.sub,casnio_type:"unmatch",event_type:"luckysevenb"},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}

function teenpattit20(req, res) {
	//////////////console.log(req.params.id);
    Userbet.find({user_id:req.user.sub,casnio_type:"unmatch",event_type:"teenpattit20"},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}
function andarbahar(req, res) {
	//////////////console.log(req.params.id);
    Userbet.find({user_id:req.user.sub,casnio_type:"unmatch",event_type:"andarbahar"},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}
function worli2(req, res) {
	//////////////console.log(req.params.id);
    Userbet.find({user_id:req.user.sub,casnio_type:"unmatch",event_type:"worli2"},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}

function casinoresultdetails(req, res) {
	//////////////console.log(req.params.id);
    Userbet.find({user_id:req.user.sub,casnio_type:"unmatch",event_type:req.params.id},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}


async function user_transactions_cal(req, res) {
	//////////////console.log(req.params.id);
  var result=await  User.find({parentid:req.user.sub,userType:6});
		var new_array=[];
		if(result!=undefined){
			for(i=0;i<result.length;i++){
				
			
			
					var admintransaction = await Admintransaction.aggregate( [
					{ $match: { user_id: new ObjectId(result[i]._id)} },
					{
					  $group: {
						 _id: "$amount",
					

					  }
					},
				  
				 ] )
				
				var amount =0;
				
				if(admintransaction!=null && admintransaction!=undefined && admintransaction!=''){
					
					amount=	admintransaction[0]._id;
				}
					new_array.push({'username':result[i].username,
					'amount':parseFloat(result[i].creditAmount) - parseFloat(amount),
				})
			}	
			res.json({ success: true, message: 'Sucess', Betlist:  new_array})
			
		}   
}




async function oodsRequest(req, res) {

// var axios = require('axios');
// var data = '';
// var config = {
//   method: 'get',
//   url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport=cricket',
//   headers: { 
//     'key': 'D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9', 
//     'Cookie': 'XSRF-TOKEN=eyJpdiI6ImdUR2tzYmU2ZWF0bDM2ZmUzM2d1bEE9PSIsInZhbHVlIjoiWEJPWU1UcWQyejRhdFJqcGtEWmJRRlpCXC9kbnpEMHdaN2lVUWNNcHEwSFwvOUNaclhFNXpHRktZbkpNcllrSnFXIiwibWFjIjoiNjU2Mzk3MWMzMTg4ZGUzOGI1N2I1OTk0NGY5OGYyOTIyNmEwODczNWZlNjI5ODYzNDhjNzVmYzkxMTYwODUxYyJ9; laravel_session=eyJpdiI6IklvNmE4UVwvMFQrdVNRR0RxbmtrTTlRPT0iLCJ2YWx1ZSI6Ik1JTm9XWW53SXZETUhUVVdTTE1Jd0Y2NkZcL0lcL3JtUmZ3cG9DXC9jYWh5cmZvZitUTUwyS28wK2hOd2Z2bjlMTTEiLCJtYWMiOiIzMTBiMjg3M2NjNWQ4ZGY4MzIwMmU5NWJmYmQ4NzZlYTdkNDUyN2U3OTM5MDJkZjRjZGUyYmFhMDRkNmY1NmZjIn0%3D'
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });

}
async function _delete(id) {
    await User.findByIdAndRemove(id);
}