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
const Hidematcheslist = db.Hidematcheslist; 
const Matchdeclare = db.Matchdeclare; 
const Suspend = db.Suspend; 
var jsonData= require('./resp.json');
const MatchResultDb = db.Matchresult;
const Fancylivedata = db.Fancylivedata;
const Matchlist = db.Matchlist; 
const Bookmakerlist = db.Bookmakerlist; 
const Userpermission = db.Userpermission; 
const Manualmatch = db.Manualmatch; 
const Fancylist = db.Fancylist; 


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
    matchResult,
	setMatchWinnerByAdmin,
	setMatchWinnerByApi,
	SuspendData,
	checkMatchComplete,
	saveMatchResult,
	fancyApi,
	casino,
	casino_teenpati_t20,
	convertUnmatchToMatchCron,
	casinoresultdt20,
	admin_profit_loss,
	casinoresultunmatchtomatch,
	updatematchlist ,
	casinoresultteenpati,
	addbookmaker,
	getBookmarketByMatchId,
	casino_dt_one_day,
	usercasinodeatils,
	getuserbetmatches,
	getuserbetmatchesid,
	addUserPermission,
	permissionUsersList,
	getuserpermission,
	update_user_permission,
	userpermission,
	getuserbetmatches1,
	getuserbetmatchesbookmaker,
	getchildfancybetlist,
	getuserbetmatchesfancy,
	getfancybetlist,
	userbetlistadmin,
	userbetlistbook_admin,
	card32_result,
	lucky7b_result,
	result_rollback,
	setFancyResultByAdmin,
	Fancylist,
	fancy_result_rollback

};


async function getfancybetlist(req,res){
	
	var eventId = req.body.event_id;
	var eventType = req.body.event_type;
	var teamName = req.body.team_name;
	
	var getfancyBetList = await Userbet.find({event_id:eventType,event_id:eventId,team_name:teamName}).populate("user_id");
	if(getfancyBetList.length>0){
		res.json({"success":true,"message":"fancyBet List","data":getfancyBetList})	
	}
	else {
		res.json({"success":false,"message":"fancyBet List","data":getfancyBetList})
	}
	
}
async function getchildfancybetlist(req,res){
	
	var getCurrentUserId = req.user.sub;
	var eventId = req.body.event_id;
	var eventType = req.body.event_type;
	
	
	var collectChildArr=[];
	var collectChildUserArr=[];
	collectChildArr.push(getCurrentUserId);
	var getMyChild = await User.find({parentid:getCurrentUserId,userType:{ $not:{ $eq: 6 }}});
	if(getMyChild.length>0){
		for(var a=0;a<getMyChild.length;a++){
			var singleChild = getMyChild[a];
			var getSingleId = singleChild._id;
			collectChildArr.push(getSingleId);
			
			
			// get Child 
			var getMyChildA = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
			if(getMyChildA.length>0){
				for(var b=0; b < getMyChildA.length;b++){
					var singleChild = getMyChildA[b];
					var getSingleId = singleChild._id;
					collectChildArr.push(getSingleId);
					
					// get Child 
					var getMyChildB = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
					if(getMyChildB.length>0){
						for(var c=0; c < getMyChildB.length;c++){
							var singleChild = getMyChildB[c];
							var getSingleId = singleChild._id;
							collectChildArr.push(getSingleId);
							
							// get Child 
							var getMyChildC = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
							if(getMyChildC.length>0){
								for(var d=0; d < getMyChildC.length;d++){
									var singleChild = getMyChildC[d];
									var getSingleId = singleChild._id;
									collectChildArr.push(getSingleId);
									
									// get Child 
									var getMyChildD = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
									if(getMyChildD.length>0){
										for(var e=0; e < getMyChildD.length;e++){
											var singleChild = getMyChildD[e];
											var getSingleId = singleChild._id;
											collectChildArr.push(getSingleId);
											//var getMyChild = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
										}
									}
									
								}
							}
							
						}
					}
					
					
				}
			}
			
			
		}
	}
	
	var getMyUserChild = await User.find({parentid:{ $in: collectChildArr },userType:6});
	if(getMyUserChild.length>0){
		for(var aa=0;aa<getMyUserChild.length;aa++){
			var singleMyUserId = getMyUserChild[aa]._id;
			collectChildUserArr.push(singleMyUserId);
		}
	}
	var returnArr = [];
	var getUserFancyData = await Userbet.aggregate([
					{ $match: { bet_on:'fancy', user_id:{ $in: collectChildUserArr },event_id:parseInt(eventId),event_type:eventType}  },
					{
					  $group : {
						_id : "$team_name"
					  }
					}
				  ]);
	if(getUserFancyData.length > 0){
		for(var i=0;i<getUserFancyData.length;i++){
			var getUserFancyDataSingleId = getUserFancyData[i]._id;
			var getSingleBetDetail = await Userbet.findOne({team_name:getUserFancyDataSingleId});
			returnArr.push(getSingleBetDetail);
		}
	}
	
	if(returnArr.length>0){
		res.json({"success":true,"message":"fancyBet List","data":returnArr})	
	}
	else {
		res.json({"success":false,"message":"fancyBet List","data":returnArr})
	}
}



async function update_user_permission(req,res){
	var userParam = req.body;
	var userId = userParam.user_id;
	
	

	const user = await User.findById(userId);
	/* if(!user){
		res.json({ success: false, message: 'User not found' })
	}
	else { */
		if(userParam.password!="") {
			var userNewPassword = userParam.password;
			var newPassHash = bcrypt.hashSync(userNewPassword, 10)
			
			
			await User.updateOne({_id: new ObjectId(userId)}, {$set: { hash: newPassHash,hash_new:1 }}, {upsert: true},function(err,resu){
				//res.json({"success":true,"message":"Password Changed Successfully"})		
			});
		}
	//}
	
	
	await Userpermission.deleteMany({user_id:userId},function(err,resu){});
	
	var permissionArr = [];

	 if(userParam.admin_list==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"admin_list"});			  
	}
	if(userParam.manage_fancy==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"manage_fancy"});			  
	}
	if(userParam.gametypelist==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"gametypelist"});			  
	}
	if(userParam.manage_market==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"manage-market"});			  
	}
	if(userParam.admin_text==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"admin-text"});			  
	}
	if(userParam.addnewmatch==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"addnewmatch"});			  
	}
	if(userParam.maintainance_page==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"maintainance_page"});			  
	} 
	if(userParam.match_result_declare==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"match_result_declare"});			  
	} 
	if(userParam.fancy_result_declare==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"fancy_result_declare"});			  
	} 
	Userpermission.insertMany(permissionArr,function(err,resu){
			if(err!==null){
				res.json({ success: false, message: 'unable to update permission',err: err});
			}
			else {
				res.json({ success: true, message: 'permission updated successfully' });
			}
	});
}


async function userpermission(req,res){
	var getId = req.user.sub;
	var getData = await Userpermission.find({user_id:getId});
	if(getData===undefined || getData.length==0){
		res.json({ success: false, message: 'no data found'});
	}
	else {
		res.json({ success: true, message: 'permission data',data:getData});	
	}
}

async function getuserpermission(req,res){
	var getId = req.params.id;
	var getData = await Userpermission.find({user_id:getId});
	res.json({ success: true, message: 'permission data',data:getData});	
}


async function permissionUsersList(req,res){
	var returnArr=[];
	 var getGroupMatch =  await Userpermission.aggregate([
					{
					  $group : {
						_id : "$user_id"
					  }
					}
				  ]);
		for(i=0;i<getGroupMatch.length;i++){
			var userId = getGroupMatch[i]._id;
			var UserDetails = await User.findOne({_id:userId});
			returnArr.push(UserDetails);
		}	
		if(returnArr.length==0){
			res.json({ success: false, message: 'No Data Found'});	  
		}
		else {
			res.json({ success: true, message: 'permissoin user list',data:returnArr});	  
		}
}
async function addUserPermission(req,res){
	var userParam = req.body;
	if (await User.findOne({ username: userParam.username })) {
		
		res.json({ success: false, message: 'Username "' + userParam.username + '" is already taken'});
		return;
    } 
   /*  if (await User.findOne({ email: userParam.email })) {
        
		res.json({ success: false, message: 'Email "' + userParam.email + '" is already taken'});
		return;
    }  */
    const user = new User(userParam);
    var today = new Date();
    var randString = today;
    var genToken = md5(randString);
    user.verifyCode = genToken; 
    user.fullname = userParam.username; 
    user.userType = 1;
    user.emailVerify = 'Y'; 
    user.parentid = req.user.sub; 
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    } 
    await user.save();
	
	var userId = user._id;
	var permissionArr = [];
	/* var getAllKeys = userParam.keys();
	for(i=0;i < getAllKeys.length;i++){
		console.log(userParam.getAllKeys[i]);
		
	} */
	 if(userParam.admin_list==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"admin_list"});			  
	}
	if(userParam.manage_fancy==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"manage_fancy"});			  
	}
	if(userParam.gametypelist==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"gametypelist"});			  
	}
	if(userParam.manage_market==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"manage-market"});			  
	}
	if(userParam.admin_text==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"admin-text"});			  
	}
	if(userParam.addnewmatch==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"addnewmatch"});			  
	}
	if(userParam.maintainance_page==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"maintainance_page"});			  
	} 
	if(userParam.fancy_result_declare==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"fancy_result_declare"});			  
	} 
	if(userParam.match_result_declare==true) {
		permissionArr.push({user_id:new Object(userId),
							permission_name:"match_result_declare"});			  
	} 
	Userpermission.insertMany(permissionArr,function(err,resu){
			if(err!==null){
				res.json({ success: false, message: 'unable to add user',err: err});
			}
			else {
				res.json({ success: true, message: 'user added successfully' });
			}
	});
	
	
}




/* 
async function getProfitPercent(currentUserId,betUserId,eventType){
	
	var getUserDetail = await User.findOne({_id:betUserId});
	var getParentId = getUserDetail.parentid;
	if(getParentId==currentUserId){
		
		return getUserDetail.cricket_partnership_own;
	}
	else {
		return getProfitPercent(currentUserId,getParentId,eventType);
	}
	
} */


async function getuserbetmatches(req,res){
	
	var getCurrentUserId = req.user.sub;
	var collectChildArr=[];
	var collectChildUserArr=[];
	collectChildArr.push(getCurrentUserId);
	var getMyChild = await User.find({parentid:getCurrentUserId,userType:{ $not:{ $eq: 6 }}});
	if(getMyChild.length>0){
		for(var a=0;a<getMyChild.length;a++){
			var singleChild = getMyChild[a];
			var getSingleId = singleChild._id;
			collectChildArr.push(getSingleId);
			
			
			// get Child 
			var getMyChildA = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
			if(getMyChildA.length>0){
				for(var b=0; b < getMyChildA.length;b++){
					var singleChild = getMyChildA[b];
					var getSingleId = singleChild._id;
					collectChildArr.push(getSingleId);
					
					// get Child 
					var getMyChildB = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
					if(getMyChildB.length>0){
						for(var c=0; c < getMyChildB.length;c++){
							var singleChild = getMyChildB[c];
							var getSingleId = singleChild._id;
							collectChildArr.push(getSingleId);
							
							// get Child 
							var getMyChildC = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
							if(getMyChildC.length>0){
								for(var d=0; d < getMyChildC.length;d++){
									var singleChild = getMyChildC[d];
									var getSingleId = singleChild._id;
									collectChildArr.push(getSingleId);
									
									// get Child 
									var getMyChildD = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
									if(getMyChildD.length>0){
										for(var e=0; e < getMyChildD.length;e++){
											var singleChild = getMyChildD[e];
											var getSingleId = singleChild._id;
											collectChildArr.push(getSingleId);
											//var getMyChild = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
										}
									}
									
								}
							}
							
						}
					}
					
					
				}
			}
			
			
		}
	}
	
	var getMyUserChild = await User.find({parentid:{ $in: collectChildArr },userType:6});
	if(getMyUserChild.length>0){
		for(var aa=0;aa<getMyUserChild.length;aa++){
			var singleMyUserId = getMyUserChild[aa]._id;
			collectChildUserArr.push(singleMyUserId);
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
	
	var collectArr = []; 
	var returnObj=[];
	 var getGroupMatch =  await Userbet.aggregate([
					{ $match: { bet_on:{ $in: [ 'odds'] }, user_id:{ $in: collectChildUserArr },
					status:"pending",
				}  },
					{
					  $group : {
						_id : "$event_id",
						betCount : { $sum: 1 }
					  }
					}
				  ]);
	//			  res.json({ "success":false,"message":getTotalStake });
	 if(getGroupMatch.length==0){
		res.json({ "success":false,"message":"no data found" ,collectChildUserArr:collectChildUserArr,collectChildArr:collectChildArr});
	 }
	else{
		for(i=0 ; i<getGroupMatch.length; i++){
			
			var sumArr = [];
			
			
			var firstTeamTotal = 0;
			var secondTeamTotal = 0;
			var drawTeamTotal = 0;
			var eventId = getGroupMatch[i]._id;
			var betCount = getGroupMatch[i].betCount;
			if(resultDeclareMatchList.indexOf(eventId)>=0){
				continue;
			}
			
			var getEventDetail = await Userbet.findOne({event_id:eventId});	
			
			var getEventName = getEventDetail.event_name;
			var getEventType = getEventDetail.event_type;
			 var getEventNameExp =  getEventName.split(" Vs ");
		
			 if(getEventNameExp.length<2){
				   getEventNameExp =  getEventName.split(" v ");
			 }
			 var firstTeamName = getEventNameExp[0];
			 var secondTeamName = getEventNameExp[1];
			 
			 // calculation for first team
			 var getFirstTeamBetDetails = await Userbet.find({event_id:eventId,
															  team_name:firstTeamName,
															  status:"pending",
															  bet_on:{ $in: [ 'odds' ] }
															  });
			    var getProfitTotal = 0;
				var getLossTotal = 0;
				for(var k=0;k<getFirstTeamBetDetails.length;k++){
					
					var singleBetDetails = getFirstTeamBetDetails[k]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var lossAmt = singleBetDetails.stake;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					
					
					var getParentPercent = 0;
					
					// var get Parent Percent
					var getUserDetail = await User.findOne({_id:singleBetDetails.user_id});
					var getParentId = getUserDetail.parentid;
					if(getParentId!="" && getParentId==getCurrentUserId){
						
						getParentPercent =  getUserDetail.cricket_partnership_own;
					}
					else if(getParentId!="") {
						var getUserDetail = await User.findOne({_id:getParentId});
						var getParentId = getUserDetail.parentid;
						if(getParentId!="" && getParentId==getCurrentUserId){
							
							getParentPercent =  getUserDetail.cricket_partnership_own;
						}
						else if(getParentId!="") {
							var getUserDetail = await User.findOne({_id:getParentId});
							var getParentId = getUserDetail.parentid;
							if(getParentId!="" && getParentId==getCurrentUserId){
								
								getParentPercent =  getUserDetail.cricket_partnership_own;
							}
							else if(getParentId!="") {
								var getUserDetail = await User.findOne({_id:getParentId});
								var getParentId = getUserDetail.parentid;
								if(getParentId!="" && getParentId==getCurrentUserId){
									
									getParentPercent =  getUserDetail.cricket_partnership_own;
								}
								/* else {
									return getProfitPercent(currentUserId,getParentId,eventType);
								} */
							}
						}
					}
					
					
					collectArr.push({getParentPercent:getParentPercent});
					profitAmt = parseFloat(profitAmt) * parseFloat(getParentPercent/100);
					lossAmt = parseFloat(lossAmt) * parseFloat(getParentPercent/100);
					
					if(getBetType=='back'){
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(lossAmt);
					}
					
				}
				
				
				
				// calculation for second team
				var getSecondTeamBetDetails = await Userbet.find({event_id:eventId,
																  team_name:secondTeamName,
																  status:"pending",
																  bet_on:{ $in: [ 'odds'] }
																  });
			    var getProfitTotal = 0;
				var getLossTotal = 0;
				for(var k=0;k<getSecondTeamBetDetails.length;k++){
					var singleBetDetails = getSecondTeamBetDetails[k]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					
					
					var lossAmt = singleBetDetails.stake;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					
					var getParentPercent = 0;
					
					// var get Parent Percent
					var getUserDetail = await User.findOne({_id:singleBetDetails.user_id});
					var getParentId = getUserDetail.parentid;
					if(getParentId!="" && getParentId==getCurrentUserId){
						
						getParentPercent =  getUserDetail.cricket_partnership_own;
					}
					else if(getParentId!=""){
						var getUserDetail = await User.findOne({_id:getParentId});
						var getParentId = getUserDetail.parentid;
						if(getParentId!="" && getParentId==getCurrentUserId){
							
							getParentPercent =  getUserDetail.cricket_partnership_own;
						}
						else if(getParentId!="") {
							var getUserDetail = await User.findOne({_id:getParentId});
							var getParentId = getUserDetail.parentid;
							if(getParentId!="" && getParentId==getCurrentUserId){
								
								getParentPercent =  getUserDetail.cricket_partnership_own;
							}
							else if(getParentId!=""){
								var getUserDetail = await User.findOne({_id:getParentId});
								var getParentId = getUserDetail.parentid;
								if(getParentId!="" && getParentId==getCurrentUserId){
									
									getParentPercent =  getUserDetail.cricket_partnership_own;
								}
								/* else {
									return getProfitPercent(currentUserId,getParentId,eventType);
								} */
							}
						}
					}
					collectArr.push({getParentPercent:getParentPercent});
					profitAmt = parseFloat(profitAmt) * parseFloat(getParentPercent/100);
					lossAmt = parseFloat(lossAmt) * parseFloat(getParentPercent/100);
					
					
					if(getBetType=='back'){
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(profitAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(profitAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(lossAmt);
					}
				}
				
				
				
				// calculation for draw team
				var getDrawTeamBetDetails = await Userbet.find({event_id:eventId,
																  team_name:'draw',
																  status:"pending",
																  bet_on:{ $in: [ 'odds', 'bookmaker' ] }
																  });
			    var getProfitTotal = 0;
				var getLossTotal = 0;
				for(var k=0;k<getDrawTeamBetDetails.length;k++){
					var singleBetDetails = getDrawTeamBetDetails[k]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var lossAmt = singleBetDetails.stake;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					if(getBetType=='back'){
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(lossAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(profitAmt)
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(lossAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(lossAmt);
					}
				}
				
				
			
			
			
			firstTeamTotal = 0-parseFloat(firstTeamTotal);
			secondTeamTotal = 0-parseFloat(secondTeamTotal);
			drawTeamTotal = 0-parseFloat(drawTeamTotal);
			var ObjectNew = {
							eventId:getEventDetail.event_id,
							eventType:getEventDetail.event_type,
							eventName:getEventDetail.event_name,
							firstTeamName:firstTeamName,
							firstTeamTotal:parseFloat(firstTeamTotal).toFixed(2),
							secondTeamName:secondTeamName,
							secondTeamTotal:parseFloat(secondTeamTotal).toFixed(2),
							drawTeamTotal:drawTeamTotal,
							betCount:betCount,
							collectArr:collectArr
							
							
							}			
			
			returnObj.push(ObjectNew);
		}
		res.json({ "success":true,"message":"event list","data":returnObj,"allchild":collectChildUserArr,"collectChildArr":collectChildArr });
	}
	/* Userbet.findOne({match_id:req.params.match_id}).sort({_id:-1}).exec(function (err, resp){
		if (err) {
			  res.json({ "success":false,"message":"no data found",errshow: err});
		  }
		  else {
			  if(resp==null){
				  res.json({ "success":false,"message":"no data found" });
			  }
			  else {
				res.json({ "success":true,"message":"bookmaker list","data":resp });
			  }
		  }
	}) */
}
async function getuserbetmatches1(req,res){
	
	var getCurrentUserId = req.user.sub;
	var collectChildArr=[];
	var collectChildUserArr=[];
	collectChildArr.push(getCurrentUserId);
	var getMyChild = await User.find({parentid:getCurrentUserId,userType:{ $not:{ $eq: 6 }}});
	if(getMyChild.length>0){
		for(var a=0;a<getMyChild.length;a++){
			var singleChild = getMyChild[a];
			var getSingleId = singleChild._id;
			collectChildArr.push(getSingleId);
			
			
			// get Child 
			var getMyChildA = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
			if(getMyChildA.length>0){
				for(var b=0; b < getMyChildA.length;b++){
					var singleChild = getMyChildA[b];
					var getSingleId = singleChild._id;
					collectChildArr.push(getSingleId);
					
					// get Child 
					var getMyChildB = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
					if(getMyChildB.length>0){
						for(var c=0; c < getMyChildB.length;c++){
							var singleChild = getMyChildB[c];
							var getSingleId = singleChild._id;
							collectChildArr.push(getSingleId);
							
							// get Child 
							var getMyChildC = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
							if(getMyChildC.length>0){
								for(var d=0; d < getMyChildC.length;d++){
									var singleChild = getMyChildC[d];
									var getSingleId = singleChild._id;
									collectChildArr.push(getSingleId);
									
									// get Child 
									var getMyChildD = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
									if(getMyChildD.length>0){
										for(var e=0; e < getMyChildD.length;e++){
											var singleChild = getMyChildD[e];
											var getSingleId = singleChild._id;
											collectChildArr.push(getSingleId);
											//var getMyChild = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
										}
									}
									
								}
							}
							
						}
					}
					
					
				}
			}
			
			
		}
	}
	
	var getMyUserChild = await User.find({parentid:{ $in: collectChildArr },userType:6});
	if(getMyUserChild.length>0){
		for(var aa=0;aa<getMyUserChild.length;aa++){
			var singleMyUserId = getMyUserChild[aa]._id;
			collectChildUserArr.push(singleMyUserId);
		}
	}
	
		
	
	var collectArr = []; 
	var returnObj=[];
	 var getGroupMatch =  await Userbet.aggregate([
					{ $match: { bet_on:{ $in: [ 'odds'] }, user_id:{ $in: collectChildUserArr },status:"pending"}  },
					{
					  $group : {
						_id : "$event_id",
						betCount : { $sum: 1 }
					  }
					}
				  ]);
	//			  res.json({ "success":false,"message":getTotalStake });
	 if(getGroupMatch.length==0){
		res.json({ "success":false,"message":"no data found" ,collectChildUserArr:collectChildUserArr,collectChildArr:collectChildArr});
	 }
	else{
			
			var sumArr = [];
			
			
			var firstTeamTotal = 0;
			var secondTeamTotal = 0;
			var drawTeamTotal = 0;
			var eventId = req.params.id;
			var betCount = 1;
			
			
			var getEventDetail = await Userbet.findOne({event_id:eventId});	
			
			var getEventName = getEventDetail.event_name;
			var getEventType = getEventDetail.event_type;
			 var getEventNameExp =  getEventName.split(" Vs ");
		
			 if(getEventNameExp.length<2){
				   getEventNameExp =  getEventName.split(" v ");
			 }
			 var firstTeamName = getEventNameExp[0];
			 var secondTeamName = getEventNameExp[1];
			 
			 // calculation for first team
			 var getFirstTeamBetDetails = await Userbet.find({event_id:eventId,
															  team_name:firstTeamName,
															  status:"pending",
															  bet_on:{ $in: [ 'odds' ] }
															  });
			    var getProfitTotal = 0;
				var getLossTotal = 0;
				for(var k=0;k<getFirstTeamBetDetails.length;k++){
					
					var singleBetDetails = getFirstTeamBetDetails[k]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var lossAmt = singleBetDetails.stake;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					
					
					var getParentPercent = 0;
					
					// var get Parent Percent
					var getUserDetail = await User.findOne({_id:singleBetDetails.user_id});
					var getParentId = getUserDetail.parentid;
					if(getParentId!="" && getParentId==getCurrentUserId){
						
						getParentPercent =  getUserDetail.cricket_partnership_own;
					}
					else if(getParentId!="") {
						var getUserDetail = await User.findOne({_id:getParentId});
						var getParentId = getUserDetail.parentid;
						if(getParentId!="" && getParentId==getCurrentUserId){
							
							getParentPercent =  getUserDetail.cricket_partnership_own;
						}
						else if(getParentId!="") {
							var getUserDetail = await User.findOne({_id:getParentId});
							var getParentId = getUserDetail.parentid;
							if(getParentId!="" && getParentId==getCurrentUserId){
								
								getParentPercent =  getUserDetail.cricket_partnership_own;
							}
							else if(getParentId!="") {
								var getUserDetail = await User.findOne({_id:getParentId});
								var getParentId = getUserDetail.parentid;
								if(getParentId!="" && getParentId==getCurrentUserId){
									
									getParentPercent =  getUserDetail.cricket_partnership_own;
								}
								/* else {
									return getProfitPercent(currentUserId,getParentId,eventType);
								} */
							}
						}
					}
					
					
					collectArr.push({getParentPercent:getParentPercent});
					profitAmt = parseFloat(profitAmt) * parseFloat(getParentPercent/100);
					lossAmt = parseFloat(lossAmt) * parseFloat(getParentPercent/100);
					
					if(getBetType=='back'){
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(lossAmt);
					}
					
				}
				
				
				
				// calculation for second team
				var getSecondTeamBetDetails = await Userbet.find({event_id:eventId,
																  team_name:secondTeamName,
																  status:"pending",
																  bet_on:{ $in: [ 'odds'] }
																  });
			    var getProfitTotal = 0;
				var getLossTotal = 0;
				for(var k=0;k<getSecondTeamBetDetails.length;k++){
					var singleBetDetails = getSecondTeamBetDetails[k]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					
					
					var lossAmt = singleBetDetails.stake;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					
					var getParentPercent = 0;
					
					// var get Parent Percent
					var getUserDetail = await User.findOne({_id:singleBetDetails.user_id});
					var getParentId = getUserDetail.parentid;
					if(getParentId!="" && getParentId==getCurrentUserId){
						
						getParentPercent =  getUserDetail.cricket_partnership_own;
					}
					else if(getParentId!=""){
						var getUserDetail = await User.findOne({_id:getParentId});
						var getParentId = getUserDetail.parentid;
						if(getParentId!="" && getParentId==getCurrentUserId){
							
							getParentPercent =  getUserDetail.cricket_partnership_own;
						}
						else if(getParentId!="") {
							var getUserDetail = await User.findOne({_id:getParentId});
							var getParentId = getUserDetail.parentid;
							if(getParentId!="" && getParentId==getCurrentUserId){
								
								getParentPercent =  getUserDetail.cricket_partnership_own;
							}
							else if(getParentId!=""){
								var getUserDetail = await User.findOne({_id:getParentId});
								var getParentId = getUserDetail.parentid;
								if(getParentId!="" && getParentId==getCurrentUserId){
									
									getParentPercent =  getUserDetail.cricket_partnership_own;
								}
								/* else {
									return getProfitPercent(currentUserId,getParentId,eventType);
								} */
							}
						}
					}
					collectArr.push({getParentPercent:getParentPercent});
					profitAmt = parseFloat(profitAmt) * parseFloat(getParentPercent/100);
					lossAmt = parseFloat(lossAmt) * parseFloat(getParentPercent/100);
					
					
					if(getBetType=='back'){
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(profitAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(profitAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(lossAmt);
					}
				}
				
				
				
				// calculation for draw team
				var getDrawTeamBetDetails = await Userbet.find({event_id:eventId,
																  team_name:'draw',
																  status:"pending",
																  bet_on:{ $in: [ 'odds', 'bookmaker' ] }
																  });
			    var getProfitTotal = 0;
				var getLossTotal = 0;
				for(var k=0;k<getDrawTeamBetDetails.length;k++){
					var singleBetDetails = getDrawTeamBetDetails[k]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var lossAmt = singleBetDetails.stake;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					if(getBetType=='back'){
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(lossAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(profitAmt)
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(lossAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(lossAmt);
					}
				}
				
				
			
			
			
			firstTeamTotal = 0-parseFloat(firstTeamTotal);
			secondTeamTotal = 0-parseFloat(secondTeamTotal);
			drawTeamTotal = 0-parseFloat(drawTeamTotal);
			var ObjectNew = {
							eventId:getEventDetail.event_id,
							eventType:getEventDetail.event_type,
							eventName:getEventDetail.event_name,
							firstTeamName:firstTeamName,
							firstTeamTotal:parseFloat(firstTeamTotal).toFixed(2),
							secondTeamName:secondTeamName,
							secondTeamTotal:parseFloat(secondTeamTotal).toFixed(2),
							drawTeamTotal:drawTeamTotal,
							betCount:betCount,
							collectArr:collectArr
							
							
							}			
			
			returnObj.push(ObjectNew);
		
		res.json({ "success":true,"message":"event list","data":returnObj,"allchild":collectChildUserArr,"collectChildArr":collectChildArr });
	}
	/* Userbet.findOne({match_id:req.params.match_id}).sort({_id:-1}).exec(function (err, resp){
		if (err) {
			  res.json({ "success":false,"message":"no data found",errshow: err});
		  }
		  else {
			  if(resp==null){
				  res.json({ "success":false,"message":"no data found" });
			  }
			  else {
				res.json({ "success":true,"message":"bookmaker list","data":resp });
			  }
		  }
	}) */
}
async function getuserbetmatchesbookmaker(req,res){
	
	var getCurrentUserId = req.user.sub;
	var collectChildArr=[];
	var collectChildUserArr=[];
	collectChildArr.push(getCurrentUserId);
	var getMyChild = await User.find({parentid:getCurrentUserId,userType:{ $not:{ $eq: 6 }}});
	if(getMyChild.length>0){
		for(var a=0;a<getMyChild.length;a++){
			var singleChild = getMyChild[a];
			var getSingleId = singleChild._id;
			collectChildArr.push(getSingleId);
			
			
			// get Child 
			var getMyChildA = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
			if(getMyChildA.length>0){
				for(var b=0; b < getMyChildA.length;b++){
					var singleChild = getMyChildA[b];
					var getSingleId = singleChild._id;
					collectChildArr.push(getSingleId);
					
					// get Child 
					var getMyChildB = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
					if(getMyChildB.length>0){
						for(var c=0; c < getMyChildB.length;c++){
							var singleChild = getMyChildB[c];
							var getSingleId = singleChild._id;
							collectChildArr.push(getSingleId);
							
							// get Child 
							var getMyChildC = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
							if(getMyChildC.length>0){
								for(var d=0; d < getMyChildC.length;d++){
									var singleChild = getMyChildC[d];
									var getSingleId = singleChild._id;
									collectChildArr.push(getSingleId);
									
									// get Child 
									var getMyChildD = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
									if(getMyChildD.length>0){
										for(var e=0; e < getMyChildD.length;e++){
											var singleChild = getMyChildD[e];
											var getSingleId = singleChild._id;
											collectChildArr.push(getSingleId);
											//var getMyChild = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
										}
									}
									
								}
							}
							
						}
					}
					
					
				}
			}
			
			
		}
	}
	
	var getMyUserChild = await User.find({parentid:{ $in: collectChildArr },userType:6});
	if(getMyUserChild.length>0){
		for(var aa=0;aa<getMyUserChild.length;aa++){
			var singleMyUserId = getMyUserChild[aa]._id;
			collectChildUserArr.push(singleMyUserId);
		}
	}
	
		
	
	var collectArr = []; 
	var returnObj=[];
	 var getGroupMatch =  await Userbet.aggregate([
					{ $match: { bet_on:{ $in: [ 'bookmaker'] }, user_id:{ $in: collectChildUserArr },
					status:"pending",
				}  },
					{
					  $group : {
						_id : "$event_id",
						betCount : { $sum: 1 }
					  }
					}
				  ]);
	//			  res.json({ "success":false,"message":getTotalStake });
	 if(getGroupMatch.length==0){
		res.json({ "success":false,"message":"no data found" ,collectChildUserArr:collectChildUserArr,collectChildArr:collectChildArr});
	 }
	else{
			
			var sumArr = [];
			
			
			var firstTeamTotal = 0;
			var secondTeamTotal = 0;
			var drawTeamTotal = 0;
			var eventId = req.params.id;
			var betCount = 1;
			
			
			var getEventDetail = await Userbet.findOne({event_id:eventId});	
			
			var getEventName = getEventDetail.event_name;
			var getEventType = getEventDetail.event_type;
			 var getEventNameExp =  getEventName.split(" Vs ");
		
			 if(getEventNameExp.length<2){
				   getEventNameExp =  getEventName.split(" v ");
			 }
			 var firstTeamName = getEventNameExp[0];
			 var secondTeamName = getEventNameExp[1];
			 
			 // calculation for first team
			 var getFirstTeamBetDetails = await Userbet.find({event_id:eventId,
															  team_name:firstTeamName,
															  status:"pending",
															  bet_on:{ $in: [ 'bookmaker' ] }
															  });
			    var getProfitTotal = 0;
				var getLossTotal = 0;
				for(var k=0;k<getFirstTeamBetDetails.length;k++){
					
					var singleBetDetails = getFirstTeamBetDetails[k]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var lossAmt = singleBetDetails.stake;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					
					
					var getParentPercent = 0;
					
					// var get Parent Percent
					var getUserDetail = await User.findOne({_id:singleBetDetails.user_id});
					var getParentId = getUserDetail.parentid;
					if(getParentId!="" && getParentId==getCurrentUserId){
						
						getParentPercent =  getUserDetail.cricket_partnership_own;
					}
					else if(getParentId!="") {
						var getUserDetail = await User.findOne({_id:getParentId});
						var getParentId = getUserDetail.parentid;
						if(getParentId!="" && getParentId==getCurrentUserId){
							
							getParentPercent =  getUserDetail.cricket_partnership_own;
						}
						else if(getParentId!="") {
							var getUserDetail = await User.findOne({_id:getParentId});
							var getParentId = getUserDetail.parentid;
							if(getParentId!="" && getParentId==getCurrentUserId){
								
								getParentPercent =  getUserDetail.cricket_partnership_own;
							}
							else if(getParentId!="") {
								var getUserDetail = await User.findOne({_id:getParentId});
								var getParentId = getUserDetail.parentid;
								if(getParentId!="" && getParentId==getCurrentUserId){
									
									getParentPercent =  getUserDetail.cricket_partnership_own;
								}
								/* else {
									return getProfitPercent(currentUserId,getParentId,eventType);
								} */
							}
						}
					}
					
					
					collectArr.push({getParentPercent:getParentPercent});
					profitAmt = parseFloat(profitAmt) * parseFloat(getParentPercent/100);
					lossAmt = parseFloat(lossAmt) * parseFloat(getParentPercent/100);
					
					if(getBetType=='back'){
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(lossAmt);
					}
					
				}
				
				
				
				// calculation for second team
				var getSecondTeamBetDetails = await Userbet.find({event_id:eventId,
																  team_name:secondTeamName,
																  bet_on:{ $in: [ 'bookmaker'] }
																  });
			    var getProfitTotal = 0;
				var getLossTotal = 0;
				for(var k=0;k<getSecondTeamBetDetails.length;k++){
					var singleBetDetails = getSecondTeamBetDetails[k]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					
					
					var lossAmt = singleBetDetails.stake;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					
					var getParentPercent = 0;
					
					// var get Parent Percent
					var getUserDetail = await User.findOne({_id:singleBetDetails.user_id});
					var getParentId = getUserDetail.parentid;
					if(getParentId!="" && getParentId==getCurrentUserId){
						
						getParentPercent =  getUserDetail.cricket_partnership_own;
					}
					else if(getParentId!=""){
						var getUserDetail = await User.findOne({_id:getParentId});
						var getParentId = getUserDetail.parentid;
						if(getParentId!="" && getParentId==getCurrentUserId){
							
							getParentPercent =  getUserDetail.cricket_partnership_own;
						}
						else if(getParentId!="") {
							var getUserDetail = await User.findOne({_id:getParentId});
							var getParentId = getUserDetail.parentid;
							if(getParentId!="" && getParentId==getCurrentUserId){
								
								getParentPercent =  getUserDetail.cricket_partnership_own;
							}
							else if(getParentId!=""){
								var getUserDetail = await User.findOne({_id:getParentId});
								var getParentId = getUserDetail.parentid;
								if(getParentId!="" && getParentId==getCurrentUserId){
									
									getParentPercent =  getUserDetail.cricket_partnership_own;
								}
								/* else {
									return getProfitPercent(currentUserId,getParentId,eventType);
								} */
							}
						}
					}
					collectArr.push({getParentPercent:getParentPercent});
					profitAmt = parseFloat(profitAmt) * parseFloat(getParentPercent/100);
					lossAmt = parseFloat(lossAmt) * parseFloat(getParentPercent/100);
					
					
					if(getBetType=='back'){
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(profitAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(profitAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(lossAmt);
					}
				}
				
				
				
				// calculation for draw team
				var getDrawTeamBetDetails = await Userbet.find({event_id:eventId,
																  team_name:'draw',
																  status:"pending",
																  bet_on:{ $in: [  'bookmaker' ] }
																  });
			    var getProfitTotal = 0;
				var getLossTotal = 0;
				for(var k=0;k<getDrawTeamBetDetails.length;k++){
					var singleBetDetails = getDrawTeamBetDetails[k]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var lossAmt = singleBetDetails.stake;
					
						

					var profitAmt = parseFloat(getOdds)*parseFloat(lossAmt);

					if(getBetType=='back'){
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(lossAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(profitAmt)
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(lossAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(lossAmt);
					}
				}
				
				
			
			
			
			firstTeamTotal = 0-parseFloat(firstTeamTotal);
			secondTeamTotal = 0-parseFloat(secondTeamTotal);
			drawTeamTotal = 0-parseFloat(drawTeamTotal);
			var ObjectNew = {
							eventId:getEventDetail.event_id,
							eventType:getEventDetail.event_type,
							eventName:getEventDetail.event_name,
							firstTeamName:firstTeamName,
							firstTeamTotal:parseFloat(firstTeamTotal).toFixed(2),
							secondTeamName:secondTeamName,
							secondTeamTotal:parseFloat(secondTeamTotal).toFixed(2),
							drawTeamTotal:drawTeamTotal,
							betCount:betCount,
							collectArr:collectArr
							
							
							}			
			
			returnObj.push(ObjectNew);
		
		res.json({ "success":true,"message":"event list","data":returnObj,"allchild":collectChildUserArr,"collectChildArr":collectChildArr });
	}
	/* Userbet.findOne({match_id:req.params.match_id}).sort({_id:-1}).exec(function (err, resp){
		if (err) {
			  res.json({ "success":false,"message":"no data found",errshow: err});
		  }
		  else {
			  if(resp==null){
				  res.json({ "success":false,"message":"no data found" });
			  }
			  else {
				res.json({ "success":true,"message":"bookmaker list","data":resp });
			  }
		  }
	}) */
}

async function getuserbetmatchesfancy(req,res){
	
	var getCurrentUserId = req.user.sub;
	var collectChildArr=[];
	var collectChildUserArr=[];
	var new_array=[];
	collectChildArr.push(getCurrentUserId);
	var getMyChild = await User.find({parentid:getCurrentUserId,userType:{ $not:{ $eq: 6 }}});
	if(getMyChild.length>0){
		for(var a=0;a<getMyChild.length;a++){
			var singleChild = getMyChild[a];
			var getSingleId = singleChild._id;
			collectChildArr.push(getSingleId);
			
			
			// get Child 
			var getMyChildA = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
			if(getMyChildA.length>0){
				for(var b=0; b < getMyChildA.length;b++){
					var singleChild = getMyChildA[b];
					var getSingleId = singleChild._id;
					collectChildArr.push(getSingleId);
					
					// get Child 
					var getMyChildB = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
					if(getMyChildB.length>0){
						for(var c=0; c < getMyChildB.length;c++){
							var singleChild = getMyChildB[c];
							var getSingleId = singleChild._id;
							collectChildArr.push(getSingleId);
							
							// get Child 
							var getMyChildC = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
							if(getMyChildC.length>0){
								for(var d=0; d < getMyChildC.length;d++){
									var singleChild = getMyChildC[d];
									var getSingleId = singleChild._id;
									collectChildArr.push(getSingleId);
									
									// get Child 
									var getMyChildD = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
									if(getMyChildD.length>0){
										for(var e=0; e < getMyChildD.length;e++){
											var singleChild = getMyChildD[e];
											var getSingleId = singleChild._id;
											collectChildArr.push(getSingleId);
											//var getMyChild = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
										}
									}
									
								}
							}
							
						}
					}
					
					
				}
			}
			
			
		}
	}
	
	var getMyUserChild = await User.find({parentid:{ $in: collectChildArr },userType:6});
	if(getMyUserChild.length>0){
		for(var aa=0;aa<getMyUserChild.length;aa++){
			var singleMyUserId = getMyUserChild[aa]._id;
			collectChildUserArr.push(singleMyUserId);
		}
	}
	
		
	
	var collectArr = []; 
	var returnObj=[];
	 var getGroupMatch =  await Userbet.aggregate([
					{ $match: { bet_on:{ $in: [ 'fancy'] }, user_id:{ $in: collectChildUserArr },
					status:"pending",event_id:parseFloat(req.params.id)
				}  },
					{
					  $group : {
						_id : "$headname",
						
					  }
					}
				  ]);
	//			  res.json({ "success":false,"message":getTotalStake });
	 if(getGroupMatch.length==0){
		res.json({ "success":false,"message":"no data found" ,collectChildUserArr:collectChildUserArr,collectChildArr:collectChildArr});
	 }
	else{
		
		for(i=0 ; i<getGroupMatch.length; i++){
			
			var sumArr = [];
			
			
			var firstTeamTotal = 0;
			var secondTeamTotal = 0;
			var drawTeamTotal = 0;
			var eventId = getGroupMatch[i]._id;
			var betCount = getGroupMatch[i].betCount;
			
			
			var getEventDetail = await Userbet.findOne({event_id:req.params.id});	
			
			var getEventName = getEventDetail.event_name;
			var headname = getEventDetail.headname;
			var getEventType = getEventDetail.event_type;
			 var getEventNameExp =  getEventName.split(" Vs ");
		
			 if(getEventNameExp.length<2){
				   getEventNameExp =  getEventName.split(" v ");
			 }
			 var firstTeamName = getEventNameExp[0];
			 var secondTeamName = getEventNameExp[1];
			 
			 // calculation for first team
			 var getFirstTeamBetDetails = await Userbet.find({event_id:req.params.id,
																status:"pending",
																headname:eventId,
															  bet_on:{ $in: [ 'fancy' ] }
															  });
			   
				
															  var getProfitTotal = 0;
				var getLossTotal = 0;
				for(var k=0;k<getFirstTeamBetDetails.length;k++){
					
					var singleBetDetails = getFirstTeamBetDetails[k]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var lossAmt = singleBetDetails.stake;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					
					
					var getParentPercent = 0;
					
					// var get Parent Percent
					var getUserDetail = await User.findOne({_id:singleBetDetails.user_id});
					var getParentId = getUserDetail.parentid;
					if(getParentId!="" && getParentId==getCurrentUserId){
						
						getParentPercent =  getUserDetail.cricket_partnership_own;
					}
					else if(getParentId!="") {
						var getUserDetail = await User.findOne({_id:getParentId});
						var getParentId = getUserDetail.parentid;
						if(getParentId!="" && getParentId==getCurrentUserId){
							
							getParentPercent =  getUserDetail.cricket_partnership_own;
						}
						else if(getParentId!="") {
							var getUserDetail = await User.findOne({_id:getParentId});
							var getParentId = getUserDetail.parentid;
							if(getParentId!="" && getParentId==getCurrentUserId){
								
								getParentPercent =  getUserDetail.cricket_partnership_own;
							}
							else if(getParentId!="") {
								var getUserDetail = await User.findOne({_id:getParentId});
								var getParentId = getUserDetail.parentid;
								if(getParentId!="" && getParentId==getCurrentUserId){
									
									getParentPercent =  getUserDetail.cricket_partnership_own;
								}
								/* else {
									return getProfitPercent(currentUserId,getParentId,eventType);
								} */
							}
						}
					}
					
					
					collectArr.push({getParentPercent:getParentPercent});
					profitAmt = parseFloat(profitAmt) * parseFloat(getParentPercent/100);
					lossAmt = parseFloat(lossAmt) * parseFloat(getParentPercent/100);
					
					var obj={
						teamname:eventId,
						stake:lossAmt

					}
					new_array.push(obj);
				}
				
				
				
				// calculation for second team
			
			   
				
				
				
				// calculation for draw team
				
				
				
			
			
			
						
			
			
		}
		res.json({ "success":true,"message":"event list","data":new_array,"allchild":collectChildUserArr,"collectChildArr":collectChildArr,data1:getFirstTeamBetDetails });
	}
	/* Userbet.findOne({match_id:req.params.match_id}).sort({_id:-1}).exec(function (err, resp){
		if (err) {
			  res.json({ "success":false,"message":"no data found",errshow: err});
		  }
		  else {
			  if(resp==null){
				  res.json({ "success":false,"message":"no data found" });
			  }
			  else {
				res.json({ "success":true,"message":"bookmaker list","data":resp });
			  }
		  }
	}) */
}



async function getuserbetmatchesid(req,res){
	
	var getCurrentUserId = req.user.sub;
	var collectChildArr=[];
	var collectChildUserArr=[];
	collectChildArr.push(getCurrentUserId);
	var getMyChild = await User.find({parentid:getCurrentUserId,userType:{ $not:{ $eq: 6 }}});
	if(getMyChild.length>0){
		for(var a=0;a<getMyChild.length;a++){
			var singleChild = getMyChild[a];
			var getSingleId = singleChild._id;
			collectChildArr.push(getSingleId);
			
			
			// get Child 
			var getMyChildA = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
			if(getMyChildA.length>0){
				for(var b=0; b < getMyChildA.length;b++){
					var singleChild = getMyChildA[b];
					var getSingleId = singleChild._id;
					collectChildArr.push(getSingleId);
					
					// get Child 
					var getMyChildB = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
					if(getMyChildB.length>0){
						for(var c=0; c < getMyChildB.length;c++){
							var singleChild = getMyChildB[c];
							var getSingleId = singleChild._id;
							collectChildArr.push(getSingleId);
							
							// get Child 
							var getMyChildC = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
							if(getMyChildC.length>0){
								for(var d=0; d < getMyChildC.length;d++){
									var singleChild = getMyChildC[d];
									var getSingleId = singleChild._id;
									collectChildArr.push(getSingleId);
									
									// get Child 
									var getMyChildD = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
									if(getMyChildD.length>0){
										for(var e=0; e < getMyChildD.length;e++){
											var singleChild = getMyChildD[e];
											var getSingleId = singleChild._id;
											collectChildArr.push(getSingleId);
											//var getMyChild = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
										}
									}
									
								}
							}
							
						}
					}
					
					
				}
			}
			
			
		}
	}
	
	var getMyUserChild = await User.find({parentid:{ $in: collectChildArr },userType:6});
	if(getMyUserChild.length>0){
		for(var aa=0;aa<getMyUserChild.length;aa++){
			var singleMyUserId = getMyUserChild[aa]._id;
			collectChildUserArr.push(singleMyUserId);
		}
	}
	console.log(collectChildUserArr)
	var arr=[];
			if(collectChildUserArr!=undefined)
			{
				for(var i=0;i<collectChildUserArr.length;i++){
					console.log(collectChildUserArr[i]);
					var getUnMatchOddsBet = await Userbet.find({user_id: collectChildUserArr[i],event_id:req.params.id
				
				
				}).populate('user_id');
					arr.push(getUnMatchOddsBet);
				}

			}
		res.json({ "success":false,"message":"sucess",data:arr });
		
	 
	
	
}
function getBookmarketByMatchId(req,res){
	Bookmakerlist.findOne({match_id:req.params.match_id}).sort({_id:-1}).exec(function (err, resp){
		if (err) {
			  res.json({ "success":false,"message":"no data found",errshow: err});
		  }
		  else {
			  if(resp==null){
				  res.json({ "success":false,"message":"no data found" });
			  }
			  else {
				res.json({ "success":true,"message":"bookmaker list","data":resp });
			  }
		  }
	})
}

function addbookmaker(req,res){
	Bookmakerlist.insertMany(req.body,function(err,resp){
		if (err) {
			  res.json({ "success":false,"message":"unable to add bookmaker",errshow: err});
		  }
		  else {
				res.json({ "success":true,"message":"bookmaker added successfully" });
		  }
	})
}

function chunkArray(myArray, chunk_size){
    var results = [];
    
    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }
    
    return results;
}

async function admin_profit_loss(req,res) {  
	var startDate=req.body.startDate;
	var endDate=req.body.endDate;
	var userId=req.body.userId;
	
	var res11 = startDate.split("T");
	var res1 = endDate.split("T");
	await Admintransaction.find(

		{
			$and : [
					 { 
					   $or : [ 
								{ remark: "profit" },
								{ remark: "loss" } 
							 ]
					 },
					 {user_id:new ObjectId(userId),createdDate:{$gt:res11[0],$lt:res1[0]},}
					 
				   ]
		  }
	).sort({ createdDate : -1}).populate('userbet_id').populate('amount_given_by').exec(function (e, result) { 
		//////////////console.log(result);
		if (result.length>0) {
			res.json({ success: true, message: 'bet list', showdata: result });
		} else {
			res.json({ success: false, message: 'bet list', showdata: [] });
		}

	}) ; 
   
}

async function fancyApi(req,res){
		// var matchId = req.params.matchid;
		
		// var axios = require('axios');
		// var getSuspendData = await Suspend.findOne({event_id:matchId});
		// var isSuspended = (getSuspendData==null) ? 0 : getSuspendData.status;
		// var config = {
		//   method: 'get',
		//   url: 'https://bet247exch.com/fancy?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&match_id='+matchId,
		//   headers: { 
		// 	'Cookie': 'XSRF-TOKEN=eyJpdiI6IjU2YURwNmxneEVwSVZhcmttcTFSRGc9PSIsInZhbHVlIjoicXQzZUxpaHFXU1pmMlJkSFNjQkU5ajBmVnlhcHZUTTFXM2QwNkpNRzVBYVBkdjMrWGZ4czc1S3ZSNHYyZ1lNcSIsIm1hYyI6Ijc3YjgwOTUzZjVmYzU4NjliMzM4YWE5M2VlZTAyMGJlMzlhN2EyZjQ3ZTVhMGVmMzI4ZmUwZjg0ZTVjZmE1MTYifQ%3D%3D; laravel_session=eyJpdiI6IjBoUTRkVzUwbFBjZVBlOHpkUTlMK3c9PSIsInZhbHVlIjoicll5OXFQOWhzUzVtNTJ0V21rd09DUTFcL3ljQkVGdW5mbVVBWVwvMjdBUHlXQ2NjcVVWTlJPcGZVWktONEdjUmdyIiwibWFjIjoiMTNmMDdjNTQ4MDljODJjOWE3YjJkMmRhNWE1YjhhYzA3ODdkZTlhNGQxOTE3MGUxYzM4MWQ1NmRjOTM5ZjVjNSJ9'
		//   },
		//   httpsAgent: new https.Agent({
		// 		rejectUnauthorized: false
		// 	}),
		// };

		// var getData = await axios(config)
		// .then(function (response) {
		// 			var FancylivedataObj = new Fancylivedata();
		// 			FancylivedataObj.matchdata = JSON.stringify(response.data.data.result);
		// 			FancylivedataObj.save();
		//   return  response.data.data.result;
		// });

			
		// res.json({"success":true,"message":"fancy data","alldata":getData,"suspendcount":isSuspended}) 	
}

async function casino(req,res){
	// var matchId = req.params.matchid;
	
	// var axios = require('axios');

	// var config = {
	//   method: 'get',
	//   url: 'https://firestorenew-da5f7.firebaseio.com/DTT20Data/cards.json',
	//   headers: { 
	// 	'Cookie': 'XSRF-TOKEN=eyJpdiI6IjU2YURwNmxneEVwSVZhcmttcTFSRGc9PSIsInZhbHVlIjoicXQzZUxpaHFXU1pmMlJkSFNjQkU5ajBmVnlhcHZUTTFXM2QwNkpNRzVBYVBkdjMrWGZ4czc1S3ZSNHYyZ1lNcSIsIm1hYyI6Ijc3YjgwOTUzZjVmYzU4NjliMzM4YWE5M2VlZTAyMGJlMzlhN2EyZjQ3ZTVhMGVmMzI4ZmUwZjg0ZTVjZmE1MTYifQ%3D%3D; laravel_session=eyJpdiI6IjBoUTRkVzUwbFBjZVBlOHpkUTlMK3c9PSIsInZhbHVlIjoicll5OXFQOWhzUzVtNTJ0V21rd09DUTFcL3ljQkVGdW5mbVVBWVwvMjdBUHlXQ2NjcVVWTlJPcGZVWktONEdjUmdyIiwibWFjIjoiMTNmMDdjNTQ4MDljODJjOWE3YjJkMmRhNWE1YjhhYzA3ODdkZTlhNGQxOTE3MGUxYzM4MWQ1NmRjOTM5ZjVjNSJ9'
	//   },
	//   httpsAgent: new https.Agent({
	// 		rejectUnauthorized: false
	// 	}),
	// };

	// var getData = await axios(config)
	// .then(function (response) {
	//   return  response.data.data;
	// });

		
	// res.json({"success":true,"message":"fancy data","alldata":getData}) 	
}

async function casino_teenpati_t20(req,res){
	
	var axios = require('axios');

	var config = {
	  method: 'get',
	  url: 'http://52.14.42.66/JSON/teenpatti-t20.json',
	  headers: { 
		'Cookie': 'XSRF-TOKEN=eyJpdiI6IjU2YURwNmxneEVwSVZhcmttcTFSRGc9PSIsInZhbHVlIjoicXQzZUxpaHFXU1pmMlJkSFNjQkU5ajBmVnlhcHZUTTFXM2QwNkpNRzVBYVBkdjMrWGZ4czc1S3ZSNHYyZ1lNcSIsIm1hYyI6Ijc3YjgwOTUzZjVmYzU4NjliMzM4YWE5M2VlZTAyMGJlMzlhN2EyZjQ3ZTVhMGVmMzI4ZmUwZjg0ZTVjZmE1MTYifQ%3D%3D; laravel_session=eyJpdiI6IjBoUTRkVzUwbFBjZVBlOHpkUTlMK3c9PSIsInZhbHVlIjoicll5OXFQOWhzUzVtNTJ0V21rd09DUTFcL3ljQkVGdW5mbVVBWVwvMjdBUHlXQ2NjcVVWTlJPcGZVWktONEdjUmdyIiwibWFjIjoiMTNmMDdjNTQ4MDljODJjOWE3YjJkMmRhNWE1YjhhYzA3ODdkZTlhNGQxOTE3MGUxYzM4MWQ1NmRjOTM5ZjVjNSJ9'
	  },
	  
	};

	var getData = await axios(config)
	.then(function (response) {
	  return  response.data;
	});

		console.log(getData);
	res.json({"success":true,"message":"fancy data","alldata":getData}) 	
}




async function saveMatchResult(req,res){
// 		var marketId = req.params.marketid;
// 		var data = JSON.stringify({"marketIds":[marketId],"result":1});
   
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
// 	    };
	   
// 	    var getAllData =  await axios(config).then(function (response) {   return response.data;	});
	   
// 		var MatchResultDbObj = new MatchResultDb();
// 		MatchResultDbObj.matchdata = JSON.stringify(getAllData);
// 		MatchResultDbObj.save();
			
// 		res.json({"success":true,"message":"Match Hide Successfully","marketId":marketId,"getAllData":getAllData}) 	
// }
}
/* 
async function convertUnmatchToMatchCron(req,res){
	var allMatchData = [];
	
	
	
	  var getTotalStake =  await Userbet.aggregate([
	 	{ $match: {type:'unmatch',status:'pending',bet_type: { $in:['odds','bookmaker']}}}  ,
		 
	 	{
	 	  $group : {
	 		_id : "$market_id",
	 	}
	 	}
	   ]);
	 
	  var groupArr =  chunkArray(getTotalStake,10);
	  for(i=0;i<groupArr.length;i++){
	 	   var newArr = [];
	 	    for(j=0;j<groupArr[i].length;j++){
	 			newArr.push(groupArr[i][j]._id);
	 		}
	 		var data = JSON.stringify({"marketIds":newArr});
   
	 		var config = {
	 			method: 'post',
	 			url: 'https:bet247exch.com/odds',
	 			headers: { 
	 				'key': 'D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9', 
	 				'Content-Type': 'application/json', 
	 				'Cookie': 'XSRF-TOKEN=eyJpdiI6IkpibzE5akRzV0tGUWpcL25XamZ5RjR3PT0iLCJ2YWx1ZSI6ImhzZEhcL1lINHpPSEhPaUxvVXhvU0gybWtET1hUa2Z3Ym5hZVczdHhzQnhObUpHVFB2cFBPNTRhVFVUUVhZYlNHIiwibWFjIjoiOWU1YmVmNjAxYTU4ZDI0ZTRkMDQzZTcwZmYxNDM5MTE0NDUwNDk3YWRjNGRiNzYzNDE5NDE2NThhNDlmMTliOCJ9; laravel_session=eyJpdiI6IkxEdE1paUJPQ1paa3NjYXA4UXBORHc9PSIsInZhbHVlIjoiemFudzBQZmhLTWdKXC9kd2d0OFwvNFwveXUxa1FsNFZaeThrckZZbzg3SUNTODBBUUN5VkJBYTJLcm0rbk9lcU9vbSIsIm1hYyI6ImI2ZjYyNjk3MTgzMzA0MDA5YTE2NmExZDY5MGExMjkzNzM1YTJkZTQzYjQzMjAyYWM1MjNlN2NmMDcyNjIzODYifQ%3D%3D'
	 			},
	 			httpsAgent: new https.Agent({
	 				rejectUnauthorized: false
	 			}),
	 			data : data
	 	   };
		  
	 		var matchDataArr = await axios(config).then(function (response1) {
	 								return response1.data.data.result;
									
	 							}) ;
	 		console.log(matchDataArr);						
								
	 		 if(matchDataArr!=null){
			
	 			 for(let matchKey of Object.keys(matchDataArr)){
	 				  var matchDataArrSingle = matchDataArr[matchKey];
					
	 					var  values = matchDataArrSingle;
	 					var matchStatus =  values.status;
	 					var marketId = values.marketId; 
						
							
	 					for(var i=0;i<values.runners.length;i++){
	 						var selectionId = values.runners[i].selectionId;
	 						var currentRateBack = values.runners[i].ex.availableToBack[0].price;
	 						var currentRateLay = values.runners[i].ex.availableToLay[0].price;
	 						var getTeamStatus = values.runners[i].status;
	 						var getUnMatchOddsBet = await Userbet.find({selection_id: selectionId,type:'unmatch',status:'pending',bet_type: { $not:{ $eq: "fancy" }}});
							
							
	 						if(getUnMatchOddsBet!=null && getUnMatchOddsBet.length>0){
								
	 							for(var a=0;a<getUnMatchOddsBet.length;a++){
									
	 								var userBetData = getUnMatchOddsBet[a];
	 								var userBetId = userBetData._id;
	 								var userOdds = userBetData.odds;
	 								var userCurrentOdds = userBetData.current_market_odds;
	 								var newOddsValue = (userBetData.bet_type=='back') ? currentRateBack : currentRateLay;
	 								var userBetNewType = userBetData.type;
	 								
	 								if(newOddsValue > userBetData.current_market_odds){
	 									console.log('1');
	 									userBetNewType = (userOdds >=userCurrentOdds && userOdds <= newOddsValue) ? 'match' : userBetNewType;
	 								}
	 								else {
	 									console.log('2');
	 									userBetNewType = (userOdds >=newOddsValue && userOdds <= userCurrentOdds ) ? 'match' : userBetNewType;
	 								}
	 								console.log(userBetNewType);
	 								console.log(userBetId);
									
	 								if(userBetNewType=='match') {
	 									await Userbet.updateOne({_id: new ObjectId(userBetId)}, { $set:{ type: userBetNewType,matchDate:Date.now()} }, {upsert: true},function(err,resu){});
	 								}
									
	 							}
	 						}
							
	 					} 
	 				} 
	 		 }
	 	}
	  	res.json({"success":true,"message":"Match Hide Successfully"}) 	
			
} */







async function convertUnmatchToMatchCron(req,res){
	var allMatchData = [];
	
	var newArr = [];
	
	  var getTotalStake =  await Userbet.aggregate([
	 	{ $match: {type:'unmatch',status:'pending',bet_on: { $in:['odds','bookmaker']}}}  ,
		 
	 	{
	 	  $group : {
	 		_id : "$market_id",
	 	}
	 	}
	   ]);
	 
	//  var groupArr =  chunkArray(getTotalStake,10);
	  for(i=0;i<getTotalStake.length;i++){
	 	   
	 	   
	 		
			var marketId  = getTotalStake[i]._id;
	 		 var config = {
				 method: 'get',
				 url: 'http://172.105.37.187/json/'+marketId+'.json',
				 headers: { 
				   'key': 'D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9', 
				   'Content-Type': 'application/json', 
				   'Cookie': 'XSRF-TOKEN=eyJpdiI6IkpibzE5akRzV0tGUWpcL25XamZ5RjR3PT0iLCJ2YWx1ZSI6ImhzZEhcL1lINHpPSEhPaUxvVXhvU0gybWtET1hUa2Z3Ym5hZVczdHhzQnhObUpHVFB2cFBPNTRhVFVUUVhZYlNHIiwibWFjIjoiOWU1YmVmNjAxYTU4ZDI0ZTRkMDQzZTcwZmYxNDM5MTE0NDUwNDk3YWRjNGRiNzYzNDE5NDE2NThhNDlmMTliOCJ9; laravel_session=eyJpdiI6IkxEdE1paUJPQ1paa3NjYXA4UXBORHc9PSIsInZhbHVlIjoiemFudzBQZmhLTWdKXC9kd2d0OFwvNFwveXUxa1FsNFZaeThrckZZbzg3SUNTODBBUUN5VkJBYTJLcm0rbk9lcU9vbSIsIm1hYyI6ImI2ZjYyNjk3MTgzMzA0MDA5YTE2NmExZDY5MGExMjkzNzM1YTJkZTQzYjQzMjAyYWM1MjNlN2NmMDcyNjIzODYifQ%3D%3D'
				 },httpsAgent: new https.Agent({
					rejectUnauthorized: false
				  }),
				 };
		  
	 		var matchDataArr = await axios(config).then(function (response1) {
	 								return response1.data;
									
	 							}) ;
	 						
				//	allMatchData.push(matchDataArr);			
	 		if(matchDataArr!=null){
				
				
				// convert only match odds 
				var MarketOddsArr = matchDataArr.market[0].events;
	 			 for(j=0;j<MarketOddsArr.length;j++){
	 				  var matchSingleEvent = MarketOddsArr[j];
						var teamName = matchSingleEvent.RunnerName;
						var currentRateLay = matchSingleEvent.LayPrice1;
						var currentRateBack = matchSingleEvent.BackPrice1;
						
						
							
	 					
	 						var getUnMatchOddsBet = await Userbet.find({team_name: teamName,
																		market_id: marketId,
																		type:'unmatch',
																		status:'pending',
																		bet_on: { $in:['odds']}
																		
																		});
							
							
	 						if(getUnMatchOddsBet!=null && getUnMatchOddsBet.length>0){
								
	 							for(var a=0;a<getUnMatchOddsBet.length;a++){
									
	 								var userBetData = getUnMatchOddsBet[a];
	 								var userBetId = userBetData._id;
	 								var userOdds = userBetData.odds;
	 								var userCurrentOdds = userBetData.current_market_odds;
	 								var newOddsValue = (userBetData.bet_type=='back') ? currentRateBack : currentRateLay;
	 								var userBetNewType = userBetData.type;
	 								
	 								if(newOddsValue > userBetData.current_market_odds){
	 									//console.log('1');
	 									userBetNewType = (userOdds >=userCurrentOdds && userOdds <= newOddsValue) ? 'match' : userBetNewType;
	 								}
	 								else {
	 									//console.log('2');
	 									userBetNewType = (userOdds >=newOddsValue && userOdds <= userCurrentOdds ) ? 'match' : userBetNewType;
	 								}
	 								//console.log(userBetNewType);
	 								//console.log(userBetId);
									
	 								if(userBetNewType=='match') {
	 									await Userbet.updateOne({_id: new ObjectId(userBetId)}, { $set:{ type: userBetNewType,matchDate:Date.now()} }, {upsert: true},function(err,resu){});
	 								}
									
	 							}
	 						}
							
	 					
	 				} 
					
					
					
					
					
					
			// convert only bookmaker odds 
				var MarketOddsArr = matchDataArr.bookmake[0].runners;
	 			 for(k=0;k<MarketOddsArr.length;k++){
	 				  var matchSingleEvent = MarketOddsArr[k];
						var teamName = matchSingleEvent.RunnerName;
						var currentRateLay = matchSingleEvent.LayPrice1;
						var currentRateBack = matchSingleEvent.BackPrice1;
						
						
	 					
						
							
	 					
						var getUnMatchOddsBet = await Userbet.find({team_name: teamName,
																	market_id: marketId,
																	type:'unmatch',
																	status:'pending',
																	bet_on: { $in:['bookmaker']}
																	
																	});
						
						
						if(getUnMatchOddsBet!=null && getUnMatchOddsBet.length>0){
							
							for(var b=0;b<getUnMatchOddsBet.length;b++){
								
								var userBetData = getUnMatchOddsBet[b];
								var userBetId = userBetData._id;
								var userOdds = userBetData.odds;
								var userCurrentOdds = userBetData.current_market_odds;
								var newOddsValue = (userBetData.bet_type=='back') ? currentRateBack : currentRateLay;
								var userBetNewType = userBetData.type;
								
								if(newOddsValue > userBetData.current_market_odds){
									//console.log('1');
									userBetNewType = (userOdds >=userCurrentOdds && userOdds <= newOddsValue) ? 'match' : userBetNewType;
								}
								else {
									//console.log('2');
									userBetNewType = (userOdds >=newOddsValue && userOdds <= userCurrentOdds ) ? 'match' : userBetNewType;
								}
								//console.log(userBetNewType);
								//console.log(userBetId);
								
								if(userBetNewType=='match') {
									await Userbet.updateOne({_id: new ObjectId(userBetId)}, { $set:{ type: userBetNewType,matchDate:Date.now()} }, {upsert: true},function(err,resu){});
								}
								
							}
						}
							
	 					
	 				}		
					
					
					
					
					
					
					
					
	 		 }
	 	}
	  	res.json({"success":true,"message":"Match Hide Successfully"}) 	
			
}









async function updatematchlist(req,res){
	// var getMatchList = await Matchlist.find({winner_id:null});
	// if(getMatchList!=null){
		
	// 	 var groupArr =  chunkArray(getMatchList,10);
	// 	 for(i=0;i<groupArr.length;i++){
	// 	   var newArr = [];
	// 	    for(j=0;j<groupArr[i].length;j++){
	// 			newArr.push(groupArr[i][j].market_id);
	// 		}
			
	// 		var data = JSON.stringify({"marketIds":newArr,"result":1});
   
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
	// 		if(matchDataArr.length>0){
	// 			 for(let matchDataArrSingle of matchDataArr){
	// 				var oddsJsonData = matchDataArrSingle.odds;
	// 				var values = JSON.parse(matchDataArrSingle.odds);
	// 				var marketId = values.marketId;
	// 				var matchStatus =  values.status;
					
	// 				Matchlist.updateOne({market_id: marketId}, { $set:{ result_json: oddsJsonData} }, {upsert: true},function(err,resu){
	// 					//console.log(resu);
	// 				});
					
					
	// 				if(matchStatus=="CLOSED"){	
	// 					var looser_selection_id =  "";
	// 					var winner_selection_id =  "";
	// 					var winTeamName =  "";
	// 					var lossTeamName =  "";
	// 					var getMatchDetails = await Matchlist.findOne({market_id:marketId});
						
	// 					var getEventName = getMatchDetails.match_name;
	// 					 var getEventNameExp =  getEventName.split(" Vs ");
					
	// 					 if(getEventNameExp.length<2){
	// 						   getEventNameExp =  getEventName.split(" v ");
	// 					 }
					
	// 					for(i=0;i<values.runners.length;i++){
	// 						var selectionId = values.runners[i].selectionId;
	// 						var currentRateBack = values.runners[i].ex.availableToBack[0].price;
	// 						var currentRateLay = values.runners[i].ex.availableToLay[0].price;
	// 						var getTeamStatus = values.runners[i].status;
	// 						if(getTeamStatus=="LOSER"){
	// 							var lossTeamName = getEventNameExp[i];
	// 							looser_selection_id =  values.runners[i].selectionId;
	// 						}
	// 						if(getTeamStatus=="WINNER"){
	// 							var winTeamName = getEventNameExp[i];
	// 							winner_selection_id =  values.runners[i].selectionId;
	// 						}
						
						
	// 					}
	// 					var winnerTeamSelectionId = winner_selection_id;
	// 					var looserTeamSelectionId = looser_selection_id;
	// 					var updateResultObj = {winner_id: winnerTeamSelectionId,
	// 										   winner_name: winTeamName,
	// 										   looser_id: looserTeamSelectionId,
	// 										   looser_name: lossTeamName}
	// 					Matchlist.updateOne({market_id: marketId}, { $set:updateResultObj }, {upsert: true},function(err,resu){
	// 						console.log(resu);
	// 					});
	// 				}
					
					
					
					
	// 			 }
	// 		}
				
			
			
			
	// 	 }
	// }
	// res.json({"success":true,"message":"Match Hide Successfully"}) 	
}

async function checkMatchComplete(req,res) {
	// var allMatchData = [];
	
	
	
	//  var getTotalStake =  await Userbet.aggregate([
	// 	//{ $match: {type:'unmatch',status:'pending'}  },
	// 	{ $match: {type:'match',status:'pending',bet_type: { $not:{ $eq: "fancy" }}}}  ,
		 
	// 	{
	// 	  $group : {
	// 		_id : "$market_id",
	// 		//market_id: { $sum: "$market_id"}
	// 	  }
	// 	}
	//   ]);
	 
	//  var groupArr =  chunkArray(getTotalStake,10);
	
	//    for(i=0;i<groupArr.length;i++){
	// 	   var newArr = [];
	// 	    for(j=0;j<groupArr[i].length;j++){
	// 			newArr.push(groupArr[i][j]._id);
	// 		}
	// 		var data = JSON.stringify({"marketIds":newArr,"result":1});
   
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
								
		 
	// 		 for(let matchDataArrSingle of matchDataArr){
	// 			var  values=JSON.parse(matchDataArrSingle.odds);
				
	// 			var matchStatus =  values.status;
	// 			var marketId = values.marketId; 
				
	// 			if(matchStatus=="CLOSED"){	
	// 				var looser_selection_id =  "";
	// 				var winner_selection_id =  "";
	// 				var winTeamName =  "";
	// 				var lossTeamName =  "";
	// 				var getMatchDetails = await Userbet.findOne({market_id:marketId});
					
	// 				var getEventName = getMatchDetails.event_name;
	// 				 var getEventNameExp =  getEventName.split(" Vs ");
				
	// 				 if(getEventNameExp.length<2){
	// 					   getEventNameExp =  getEventName.split(" v ");
	// 				 }
				
	// 				for(i=0;i<values.runners.length;i++){
	// 					var selectionId = values.runners[i].selectionId;
	// 					var currentRateBack = values.runners[i].ex.availableToBack[0].price;
	// 					var currentRateLay = values.runners[i].ex.availableToLay[0].price;
	// 					var getTeamStatus = values.runners[i].status;
	// 					if(getTeamStatus=="LOSER"){
	// 						var lossTeamName = getEventNameExp[i];
	// 						looser_selection_id =  values.runners[i].selectionId;
	// 					}
	// 					if(getTeamStatus=="WINNER"){
	// 						var winTeamName = getEventNameExp[i];
	// 						winner_selection_id =  values.runners[i].selectionId;
	// 					}
	// 				/* 	var looser_selection_id = (getTeamStatus=="LOSER") ? values.runners[i].selectionId : "";
	// 					var winner_selection_id = (getTeamStatus=="WINNER") ? values.runners[i].selectionId : ""; */
					
	// 				}
	// 				var winnerTeamSelectionId = winner_selection_id;
	// 				var looserTeamSelectionId = looser_selection_id;
					
	// 				var checkMatchExist = await Matchdeclare.findOne({event_id:getMatchDetails.event_id});
	// 				if(checkMatchExist == null){
	// 					var matchDeclareObj = new Matchdeclare();
	// 						matchDeclareObj.event_id = getMatchDetails.event_id;
	// 						matchDeclareObj.event_name = getMatchDetails.event_name;
	// 						matchDeclareObj.win_team_selectionid = winnerTeamSelectionId;
	// 						matchDeclareObj.loss_team_selectionid = looserTeamSelectionId
	// 						matchDeclareObj.win_team = winTeamName;
	// 						matchDeclareObj.looser_team = lossTeamName;
	// 						matchDeclareObj.sport_type = getMatchDetails.event_type;
	// 						matchDeclareObj.winner_by_api = 1;
	// 						matchDeclareObj.market_id = getMatchDetails.market_id;
	// 						matchDeclareObj.save(); 
	// 				}
					
					
	// 				matchResult(winnerTeamSelectionId,looserTeamSelectionId,null,false);
	// 			}
	// 		}
	
	//   }
	  
	 
	//   res.json({"success":true,"message":"Match Hide Successfully"}) 
	  
 }
 
	
		async function userbetlistadmin(req,res){
	
	var getCurrentUserId = req.user.sub;
	var collectChildArr=[];
	var collectChildUserArr=[];
	collectChildArr.push(getCurrentUserId);
	var getMyChild = await User.find({parentid:getCurrentUserId,userType:{ $not:{ $eq: 6 }}});
	if(getMyChild.length>0){
		for(var a=0;a<getMyChild.length;a++){
			var singleChild = getMyChild[a];
			var getSingleId = singleChild._id;
			collectChildArr.push(getSingleId);
			
			
			// get Child 
			var getMyChildA = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
			if(getMyChildA.length>0){
				for(var b=0; b < getMyChildA.length;b++){
					var singleChild = getMyChildA[b];
					var getSingleId = singleChild._id;
					collectChildArr.push(getSingleId);
					
					// get Child 
					var getMyChildB = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
					if(getMyChildB.length>0){
						for(var c=0; c < getMyChildB.length;c++){
							var singleChild = getMyChildB[c];
							var getSingleId = singleChild._id;
							collectChildArr.push(getSingleId);
							
							// get Child 
							var getMyChildC = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
							if(getMyChildC.length>0){
								for(var d=0; d < getMyChildC.length;d++){
									var singleChild = getMyChildC[d];
									var getSingleId = singleChild._id;
									collectChildArr.push(getSingleId);
									
									// get Child 
									var getMyChildD = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
									if(getMyChildD.length>0){
										for(var e=0; e < getMyChildD.length;e++){
											var singleChild = getMyChildD[e];
											var getSingleId = singleChild._id;
											collectChildArr.push(getSingleId);
											//var getMyChild = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
										}
									}
									
								}
							}
							
						}
					}
					
					
				}
			}
			
			
		}
	}
	
	var getMyUserChild = await User.find({parentid:{ $in: collectChildArr },userType:6});
	if(getMyUserChild.length>0){
		for(var aa=0;aa<getMyUserChild.length;aa++){
			var singleMyUserId = getMyUserChild[aa]._id;
			collectChildUserArr.push(singleMyUserId);
		}
	}
	
		
	
	var collectArr = []; 
	var returnObj=[];
	 var getGroupMatch =  await Userbet.aggregate([
					{ $match: { bet_on:{ $in: [ 'odds'] }, user_id:{ $in: collectChildUserArr },status:"pending"}  },
					{
					  $group : {
						_id : "$event_id",
						betCount : { $sum: 1 }
					  }
					}
				  ]);
	//			  res.json({ "success":false,"message":getTotalStake });
	 if(getGroupMatch.length==0){
		res.json({ "success":false,"message":"no data found" ,collectChildUserArr:collectChildUserArr,collectChildArr:collectChildArr});
	 }
	else{
			
			var sumArr = [];
			
			
			var firstTeamTotal = 0;
			var secondTeamTotal = 0;
			var drawTeamTotal = 0;
			var eventId = req.params.id;
			var betCount = 1;
			var new_array=[];
			
			var getEventDetail = await Userbet.findOne({event_id:eventId});	
			
			var getEventName = getEventDetail.event_name;
			var getEventType = getEventDetail.event_type;
			 var getEventNameExp =  getEventName.split(" Vs ");
		
			 if(getEventNameExp.length<2){
				   getEventNameExp =  getEventName.split(" v ");
			 }
			 var firstTeamName = getEventNameExp[0];
			 var secondTeamName = getEventNameExp[1];
			
			 // calculation for first team
			 var getFirstTeamBetDetails =  await Userbet.aggregate([
				{ $match: {
					event_id:parseFloat(req.params.id),
					
					status:"pending",
					bet_on: 'odds' }},
				{
				  $group : {
					_id : "$user_id"
				  }
				}
			  ]);
			 
			 
			 
			 
			 
			 
			 
			 
		
			 
			 


			    var getProfitTotal = 0;
				var getLossTotal = 0;
				
				for(var k=0;k<getFirstTeamBetDetails.length;k++){
					firstTeamTotal = 0;
					secondTeamTotal = 0;
					drawTeamTotal = 0;
				var getFirstTeamBetDetails1=	await Userbet.find({event_id:eventId,
						team_name:firstTeamName,
						status:"pending",
						user_id:getFirstTeamBetDetails[k]._id,
						bet_on:{ $in: [ 'odds'] }
						}).populate("user_id");
					for(var kj=0;kj<getFirstTeamBetDetails1.length;kj++){
						
					var singleBetDetails = getFirstTeamBetDetails1[kj]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var lossAmt = singleBetDetails.stake;
					var username = singleBetDetails.user_id.username;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					
					
					var getParentPercent = 0;
					
					// var get Parent Percent
					var getUserDetail = await User.findOne({_id:singleBetDetails.user_id});
					var getParentId = getUserDetail.parentid;
					if(getParentId!="" && getParentId==getCurrentUserId){
						
						getParentPercent =  getUserDetail.cricket_partnership_own;
					}
					else if(getParentId!="") {
						var getUserDetail = await User.findOne({_id:getParentId});
						var getParentId = getUserDetail.parentid;
						if(getParentId!="" && getParentId==getCurrentUserId){
							
							getParentPercent =  getUserDetail.cricket_partnership_own;
						}
						else if(getParentId!="") {
							var getUserDetail = await User.findOne({_id:getParentId});
							var getParentId = getUserDetail.parentid;
							if(getParentId!="" && getParentId==getCurrentUserId){
								
								getParentPercent =  getUserDetail.cricket_partnership_own;
							}
							else if(getParentId!="") {
								var getUserDetail = await User.findOne({_id:getParentId});
								var getParentId = getUserDetail.parentid;
								if(getParentId!="" && getParentId==getCurrentUserId){
									
									getParentPercent =  getUserDetail.cricket_partnership_own;
								}
								/* else {
									return getProfitPercent(currentUserId,getParentId,eventType);
								} */
							}
						}
					}
					
					
					collectArr.push({getParentPercent:getParentPercent});
					profitAmt = parseFloat(profitAmt) * parseFloat(getParentPercent/100);
					lossAmt = parseFloat(lossAmt) * parseFloat(getParentPercent/100);
					
					if(getBetType=='back'){
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(lossAmt);
					}
			// 		firstTeamTotal = 0-parseFloat(firstTeamTotal);
			// secondTeamTotal = 0-parseFloat(secondTeamTotal);
			// drawTeamTotal = 0-parseFloat(drawTeamTotal);
			// var  ObjectNew ={
			// 	eventId:getEventDetail.event_id,
			// 	eventType:getEventDetail.event_type,
			// 	eventName:getEventDetail.event_name,
			// 	firstTeamName:firstTeamName,
			// 	firstTeamTotal:parseFloat(firstTeamTotal).toFixed(2),
			// 	secondTeamName:secondTeamName,
			// 	secondTeamTotal:parseFloat(secondTeamTotal).toFixed(2),
			// 	drawTeamTotal:drawTeamTotal,
			// 	betCount:betCount,
			// 	collectArr:collectArr,
			// 	username:username
				
			// 	}
			// 	new_array.push(ObjectNew);
					}
				
				
				
				
				// calculation for second team
				
				
				
				
				
				
				
				
				
				
				
				
			    var getProfitTotal = 0;
				var getLossTotal = 0;

					var getSecondTeamBetDetails1=	await Userbet.find({event_id:eventId,
						team_name:secondTeamName,
						status:"pending",
						user_id:getFirstTeamBetDetails[k]._id,
						bet_on:{ $in: [ 'odds' ] }
						}).populate("user_id");
						for(var ki=0;ki<getSecondTeamBetDetails1.length;ki++){
					var singleBetDetails = getSecondTeamBetDetails1[ki]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var username = singleBetDetails.user_id.username;
					
					
					var lossAmt = singleBetDetails.stake;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					
					var getParentPercent = 0;
					
					// var get Parent Percent
					var getUserDetail = await User.findOne({_id:singleBetDetails.user_id});
					var getParentId = getUserDetail.parentid;
					if(getParentId!="" && getParentId==getCurrentUserId){
						
						getParentPercent =  getUserDetail.cricket_partnership_own;
					}
					else if(getParentId!=""){
						var getUserDetail = await User.findOne({_id:getParentId});
						var getParentId = getUserDetail.parentid;
						if(getParentId!="" && getParentId==getCurrentUserId){
							
							getParentPercent =  getUserDetail.cricket_partnership_own;
						}
						else if(getParentId!="") {
							var getUserDetail = await User.findOne({_id:getParentId});
							var getParentId = getUserDetail.parentid;
							if(getParentId!="" && getParentId==getCurrentUserId){
								
								getParentPercent =  getUserDetail.cricket_partnership_own;
							}
							else if(getParentId!=""){
								var getUserDetail = await User.findOne({_id:getParentId});
								var getParentId = getUserDetail.parentid;
								if(getParentId!="" && getParentId==getCurrentUserId){
									
									getParentPercent =  getUserDetail.cricket_partnership_own;
								}
								/* else {
									return getProfitPercent(currentUserId,getParentId,eventType);
								} */
							}
						}
					}
					collectArr.push({getParentPercent:getParentPercent});
					profitAmt = parseFloat(profitAmt) * parseFloat(getParentPercent/100);
					lossAmt = parseFloat(lossAmt) * parseFloat(getParentPercent/100);
					
					
					if(getBetType=='back'){
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(profitAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(profitAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(lossAmt);
					}
			// 		firstTeamTotal = 0-parseFloat(firstTeamTotal);
			// secondTeamTotal = 0-parseFloat(secondTeamTotal);
			// drawTeamTotal = 0-parseFloat(drawTeamTotal);
			
				}
				
				
				
				
				// calculation for draw team
			
			    var getProfitTotal = 0;
				var getLossTotal = 0;

					var getDrawTeamBetDetails1=	await Userbet.find({event_id:eventId,
							team_name:"draw",
							status:"pending",
							user_id:getFirstTeamBetDetails[k]._id,
							bet_on:{ $in: [ 'odds' ] }
							}).populate("user_id");

					for(var kw=0;kw<getDrawTeamBetDetails1.length;kw++){


					var singleBetDetails = getDrawTeamBetDetails1[kw]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var lossAmt = singleBetDetails.stake;
					var username = singleBetDetails.user_id.username;

					
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					if(getBetType=='back'){
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(lossAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(profitAmt)
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(lossAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(lossAmt);
					}
		
					
			// var  ObjectNew ={
			// 	eventId:getEventDetail.event_id,
			// 	eventType:getEventDetail.event_type,
			// 	eventName:getEventDetail.event_name,
			// 	firstTeamName:firstTeamName,
			// 	firstTeamTotal:parseFloat(firstTeamTotal).toFixed(2),
			// 	secondTeamName:secondTeamName,
			// 	secondTeamTotal:parseFloat(secondTeamTotal).toFixed(2),
			// 	drawTeamTotal:drawTeamTotal,
			// 	betCount:betCount,
			// 	collectArr:collectArr,
			// 	username:username
				
			// 	}
			// 	new_array.push(ObjectNew);	
			}
			firstTeamTotal = 0-parseFloat(firstTeamTotal);
			secondTeamTotal = 0-parseFloat(secondTeamTotal);
			drawTeamTotal = 0-parseFloat(drawTeamTotal);
			var  ObjectNew ={
				eventId:getEventDetail.event_id,
				eventType:getEventDetail.event_type,
				eventName:getEventDetail.event_name,
				firstTeamName:firstTeamName,
				firstTeamTotal:parseFloat(firstTeamTotal).toFixed(2),
				secondTeamName:secondTeamName,
				secondTeamTotal:parseFloat(secondTeamTotal).toFixed(2),
				drawTeamTotal:drawTeamTotal,
				betCount:betCount,
				collectArr:collectArr,
				username:username
				
				}
				new_array.push(ObjectNew);
			}
			
				
			
			
			
			
			//returnObj.push(ObjectNew);
		
		res.json({ "success":true,"message":"event list","data":new_array,"allchild":collectChildUserArr,"collectChildArr":collectChildArr });
	}
	/* Userbet.findOne({match_id:req.params.match_id}).sort({_id:-1}).exec(function (err, resp){
		if (err) {
			  res.json({ "success":false,"message":"no data found",errshow: err});
		  }
		  else {
			  if(resp==null){
				  res.json({ "success":false,"message":"no data found" });
			  }
			  else {
				res.json({ "success":true,"message":"bookmaker list","data":resp });
			  }
		  }
	}) */
}
	 		async function userbetlistbook_admin(req,res){
	
	var getCurrentUserId = req.user.sub;
	var collectChildArr=[];
	var collectChildUserArr=[];
	collectChildArr.push(getCurrentUserId);
	var getMyChild = await User.find({parentid:getCurrentUserId,userType:{ $not:{ $eq: 6 }}});
	if(getMyChild.length>0){
		for(var a=0;a<getMyChild.length;a++){
			var singleChild = getMyChild[a];
			var getSingleId = singleChild._id;
			collectChildArr.push(getSingleId);
			
			
			// get Child 
			var getMyChildA = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
			if(getMyChildA.length>0){
				for(var b=0; b < getMyChildA.length;b++){
					var singleChild = getMyChildA[b];
					var getSingleId = singleChild._id;
					collectChildArr.push(getSingleId);
					
					// get Child 
					var getMyChildB = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
					if(getMyChildB.length>0){
						for(var c=0; c < getMyChildB.length;c++){
							var singleChild = getMyChildB[c];
							var getSingleId = singleChild._id;
							collectChildArr.push(getSingleId);
							
							// get Child 
							var getMyChildC = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
							if(getMyChildC.length>0){
								for(var d=0; d < getMyChildC.length;d++){
									var singleChild = getMyChildC[d];
									var getSingleId = singleChild._id;
									collectChildArr.push(getSingleId);
									
									// get Child 
									var getMyChildD = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
									if(getMyChildD.length>0){
										for(var e=0; e < getMyChildD.length;e++){
											var singleChild = getMyChildD[e];
											var getSingleId = singleChild._id;
											collectChildArr.push(getSingleId);
											//var getMyChild = await User.find({parentid:getSingleId,userType:{ $not:{ $eq: 6 }}});
										}
									}
									
								}
							}
							
						}
					}
					
					
				}
			}
			
			
		}
	}
	
	var getMyUserChild = await User.find({parentid:{ $in: collectChildArr },userType:6});
	if(getMyUserChild.length>0){
		for(var aa=0;aa<getMyUserChild.length;aa++){
			var singleMyUserId = getMyUserChild[aa]._id;
			collectChildUserArr.push(singleMyUserId);
		}
	}
	
		
	
	var collectArr = []; 
	var returnObj=[];
	 var getGroupMatch =  await Userbet.aggregate([
					{ $match: { bet_on:{ $in: [ 'bookmaker'] }, user_id:{ $in: collectChildUserArr },status:"pending"}  },
					{
					  $group : {
						_id : "$event_id",
						betCount : { $sum: 1 }
					  }
					}
				  ]);
	//			  res.json({ "success":false,"message":getTotalStake });
	 if(getGroupMatch.length==0){
		res.json({ "success":false,"message":"no data found" ,collectChildUserArr:collectChildUserArr,collectChildArr:collectChildArr});
	 }
	else{
			
			var sumArr = [];
			
			
			var firstTeamTotal = 0;
			var secondTeamTotal = 0;
			var drawTeamTotal = 0;
			var eventId = req.params.id;
			var betCount = 1;
			var new_array=[];
			
			var getEventDetail = await Userbet.findOne({event_id:eventId});	
			
			var getEventName = getEventDetail.event_name;
			var getEventType = getEventDetail.event_type;
			 var getEventNameExp =  getEventName.split(" Vs ");
		
			 if(getEventNameExp.length<2){
				   getEventNameExp =  getEventName.split(" v ");
			 }
			 var firstTeamName = getEventNameExp[0];
			 var secondTeamName = getEventNameExp[1];
			
			 // calculation for first team
			 var getFirstTeamBetDetails =  await Userbet.aggregate([
				{ $match: {
					event_id:parseFloat(req.params.id),
					
					status:"pending",
					bet_on: 'bookmaker' }},
				{
				  $group : {
					_id : "$user_id"
				  }
				}
			  ]);
			 
			 
			 
			 
			 
			 
			 
			 
		
			 
			 


			    var getProfitTotal = 0;
				var getLossTotal = 0;
				
				for(var k=0;k<getFirstTeamBetDetails.length;k++){
					firstTeamTotal = 0;
					secondTeamTotal = 0;
					drawTeamTotal = 0;
				var getFirstTeamBetDetails1=	await Userbet.find({event_id:eventId,
						team_name:firstTeamName,
						status:"pending",
						user_id:getFirstTeamBetDetails[k]._id,
						bet_on:{ $in: [ 'bookmaker'] }
						}).populate("user_id");
					for(var kj=0;kj<getFirstTeamBetDetails1.length;kj++){
						
					var singleBetDetails = getFirstTeamBetDetails1[kj]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var lossAmt = singleBetDetails.stake;
					var username = singleBetDetails.user_id.username;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					
					
					var getParentPercent = 0;
					
					// var get Parent Percent
					var getUserDetail = await User.findOne({_id:singleBetDetails.user_id});
					var getParentId = getUserDetail.parentid;
					if(getParentId!="" && getParentId==getCurrentUserId){
						
						getParentPercent =  getUserDetail.cricket_partnership_own;
					}
					else if(getParentId!="") {
						var getUserDetail = await User.findOne({_id:getParentId});
						var getParentId = getUserDetail.parentid;
						if(getParentId!="" && getParentId==getCurrentUserId){
							
							getParentPercent =  getUserDetail.cricket_partnership_own;
						}
						else if(getParentId!="") {
							var getUserDetail = await User.findOne({_id:getParentId});
							var getParentId = getUserDetail.parentid;
							if(getParentId!="" && getParentId==getCurrentUserId){
								
								getParentPercent =  getUserDetail.cricket_partnership_own;
							}
							else if(getParentId!="") {
								var getUserDetail = await User.findOne({_id:getParentId});
								var getParentId = getUserDetail.parentid;
								if(getParentId!="" && getParentId==getCurrentUserId){
									
									getParentPercent =  getUserDetail.cricket_partnership_own;
								}
								/* else {
									return getProfitPercent(currentUserId,getParentId,eventType);
								} */
							}
						}
					}
					
					
					collectArr.push({getParentPercent:getParentPercent});
					profitAmt = parseFloat(profitAmt) * parseFloat(getParentPercent/100);
					lossAmt = parseFloat(lossAmt) * parseFloat(getParentPercent/100);
					
					if(getBetType=='back'){
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(lossAmt);
					}
			// 		firstTeamTotal = 0-parseFloat(firstTeamTotal);
			// secondTeamTotal = 0-parseFloat(secondTeamTotal);
			// drawTeamTotal = 0-parseFloat(drawTeamTotal);
			// var  ObjectNew ={
			// 	eventId:getEventDetail.event_id,
			// 	eventType:getEventDetail.event_type,
			// 	eventName:getEventDetail.event_name,
			// 	firstTeamName:firstTeamName,
			// 	firstTeamTotal:parseFloat(firstTeamTotal).toFixed(2),
			// 	secondTeamName:secondTeamName,
			// 	secondTeamTotal:parseFloat(secondTeamTotal).toFixed(2),
			// 	drawTeamTotal:drawTeamTotal,
			// 	betCount:betCount,
			// 	collectArr:collectArr,
			// 	username:username
				
			// 	}
			// 	new_array.push(ObjectNew);
					}
				
				
				
				
				// calculation for second team
				
				
				
				
				
				
				
				
				
				
				
				
			    var getProfitTotal = 0;
				var getLossTotal = 0;

					var getSecondTeamBetDetails1=	await Userbet.find({event_id:eventId,
						team_name:secondTeamName,
						status:"pending",
						user_id:getFirstTeamBetDetails[k]._id,
						bet_on:{ $in: [ 'bookmaker' ] }
						}).populate("user_id");
						for(var ki=0;ki<getSecondTeamBetDetails1.length;ki++){
					var singleBetDetails = getSecondTeamBetDetails1[ki]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var username = singleBetDetails.user_id.username;
					
					
					var lossAmt = singleBetDetails.stake;
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					
					var getParentPercent = 0;
					
					// var get Parent Percent
					var getUserDetail = await User.findOne({_id:singleBetDetails.user_id});
					var getParentId = getUserDetail.parentid;
					if(getParentId!="" && getParentId==getCurrentUserId){
						
						getParentPercent =  getUserDetail.cricket_partnership_own;
					}
					else if(getParentId!=""){
						var getUserDetail = await User.findOne({_id:getParentId});
						var getParentId = getUserDetail.parentid;
						if(getParentId!="" && getParentId==getCurrentUserId){
							
							getParentPercent =  getUserDetail.cricket_partnership_own;
						}
						else if(getParentId!="") {
							var getUserDetail = await User.findOne({_id:getParentId});
							var getParentId = getUserDetail.parentid;
							if(getParentId!="" && getParentId==getCurrentUserId){
								
								getParentPercent =  getUserDetail.cricket_partnership_own;
							}
							else if(getParentId!=""){
								var getUserDetail = await User.findOne({_id:getParentId});
								var getParentId = getUserDetail.parentid;
								if(getParentId!="" && getParentId==getCurrentUserId){
									
									getParentPercent =  getUserDetail.cricket_partnership_own;
								}
								/* else {
									return getProfitPercent(currentUserId,getParentId,eventType);
								} */
							}
						}
					}
					collectArr.push({getParentPercent:getParentPercent});
					profitAmt = parseFloat(profitAmt) * parseFloat(getParentPercent/100);
					lossAmt = parseFloat(lossAmt) * parseFloat(getParentPercent/100);
					
					
					if(getBetType=='back'){
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(profitAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(profitAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(lossAmt);
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(lossAmt);
					}
			// 		firstTeamTotal = 0-parseFloat(firstTeamTotal);
			// secondTeamTotal = 0-parseFloat(secondTeamTotal);
			// drawTeamTotal = 0-parseFloat(drawTeamTotal);
			
				}
				
				
				
				
				// calculation for draw team
			
			    var getProfitTotal = 0;
				var getLossTotal = 0;

					var getDrawTeamBetDetails1=	await Userbet.find({event_id:eventId,
							team_name:"draw",
							status:"pending",
							user_id:getFirstTeamBetDetails[k]._id,
							bet_on:{ $in: [ 'bookmaker' ] }
							}).populate("user_id");

					for(var kw=0;kw<getDrawTeamBetDetails1.length;kw++){


					var singleBetDetails = getDrawTeamBetDetails1[kw]
					var getOdds = singleBetDetails.odds;
					var getBetType = singleBetDetails.bet_type;
					var lossAmt = singleBetDetails.stake;
					var username = singleBetDetails.user_id.username;

					
					var profitAmt = parseFloat(parseFloat(getOdds)-1)*parseFloat(lossAmt);
					if(getBetType=='back'){
						drawTeamTotal = parseFloat(drawTeamTotal) + parseFloat(profitAmt);
						secondTeamTotal = parseFloat(secondTeamTotal) - parseFloat(lossAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) - parseFloat(lossAmt);
					}
					else if(getBetType=='lay'){
						drawTeamTotal = parseFloat(drawTeamTotal) - parseFloat(profitAmt)
						secondTeamTotal = parseFloat(secondTeamTotal) + parseFloat(lossAmt);
						firstTeamTotal = parseFloat(firstTeamTotal) + parseFloat(lossAmt);
					}
		
					
			// var  ObjectNew ={
			// 	eventId:getEventDetail.event_id,
			// 	eventType:getEventDetail.event_type,
			// 	eventName:getEventDetail.event_name,
			// 	firstTeamName:firstTeamName,
			// 	firstTeamTotal:parseFloat(firstTeamTotal).toFixed(2),
			// 	secondTeamName:secondTeamName,
			// 	secondTeamTotal:parseFloat(secondTeamTotal).toFixed(2),
			// 	drawTeamTotal:drawTeamTotal,
			// 	betCount:betCount,
			// 	collectArr:collectArr,
			// 	username:username
				
			// 	}
			// 	new_array.push(ObjectNew);	
			}
			firstTeamTotal = 0-parseFloat(firstTeamTotal);
			secondTeamTotal = 0-parseFloat(secondTeamTotal);
			drawTeamTotal = 0-parseFloat(drawTeamTotal);
			var  ObjectNew ={
				eventId:getEventDetail.event_id,
				eventType:getEventDetail.event_type,
				eventName:getEventDetail.event_name,
				firstTeamName:firstTeamName,
				firstTeamTotal:parseFloat(firstTeamTotal).toFixed(2),
				secondTeamName:secondTeamName,
				secondTeamTotal:parseFloat(secondTeamTotal).toFixed(2),
				drawTeamTotal:drawTeamTotal,
				betCount:betCount,
				collectArr:collectArr,
				username:username
				
				}
				new_array.push(ObjectNew);
			}
			
				
			
			
			
			
			//returnObj.push(ObjectNew);
		
		res.json({ "success":true,"message":"event list","data":new_array,"allchild":collectChildUserArr,"collectChildArr":collectChildArr });
	}
	/* Userbet.findOne({match_id:req.params.match_id}).sort({_id:-1}).exec(function (err, resp){
		if (err) {
			  res.json({ "success":false,"message":"no data found",errshow: err});
		  }
		  else {
			  if(resp==null){
				  res.json({ "success":false,"message":"no data found" });
			  }
			  else {
				res.json({ "success":true,"message":"bookmaker list","data":resp });
			  }
		  }
	}) */
}
	
	

 async function FancyResult(headname,score,eventId,sportType) {


    var result = await Userbet.find({event_id: eventId,headname: headname,status:'pending',bet_on:'fancy'}) ; 

		if(result.length!=0){
			var transArr = [];
			var profitLossAmt  = 0;
			for(i=0;i<result.length;i++){
				//console.log("=============FANCY LOOP START========================================");
				var singleRecord = result[i];
				var eventId = singleRecord.event_id;
				var betType = singleRecord.bet_type;
				var userbet_id = singleRecord._id;
				//var profitLossAmt = singleRecord.profit;
				var userId = singleRecord.user_id;
				var team_name = singleRecord.team_name;
				var userGuess = singleRecord.no;
				var userGuessScore = singleRecord.odds;
				var profitType = (userGuess=="no" && parseInt(score)<=parseInt(userGuessScore)) ? 'profit' : ((userGuess=="yes" && parseInt(score)>=parseInt(userGuessScore)) ? "profit" : "loss");
				var profitLossAmt = (profitType=="profit" && userGuess=="yes") ? singleRecord.back_size*singleRecord.stake/100 : singleRecord.stake;
				
				
				addProfitLossToUser(userId,profitLossAmt,userbet_id,profitType,eventId,sportType);
				
				Userbet.updateOne({_id: new ObjectId(userbet_id)}, {$set: { status: 'completed' }}, {upsert: true},function(err,resu){});
				//console.log("=============FANCY LOOP END========================================");
			}
		}
		
	
	return true;
}	

 async function matchResult(winner,eventId,sportType,revert=false) {
	console.log("winTeamName>>>>>>>>"+winner);
	console.log("eventId>>>>>>>>"+eventId);

	//var matchid = req.params.matchid;
	/*
	// revert data code
	if(revert){
		
		// set uset sets to pending
		await Userbet.updateMany({event_id: eventId,bet_on:{ $in: [ 'odds', 'bookmaker' ] }}, {$set: { status: 'pending' }}, {upsert: true},function(err,resu){});
		
		// get all event transactions
		
		var allEventTransactions = await Admintransaction.find({event_id: eventId},function(err,resp){
			return resp;
		});
		//set user profilt loss to prevous state
		if(allEventTransactions.length>0){
			for(i=0;i<allEventTransactions.length;i++){
				var getData = allEventTransactions[i];
				var profitLossAmt = getData.amount;
				var userId = getData.user_id;
				if(profitLossAmt>0){
					profitLossAmt = -profitLossAmt;
				}
				else {
					profitLossAmt = Math.abs(profitLossAmt);
				}
				const userData = await User.findById(userId); 
				
				profitLossAmt = profitLossAmt + userData.profit_loss;
				
				await User.updateOne({_id: new ObjectId(userId)}, { $set:{ profit_loss: profitLossAmt} }, {upsert: true},function(err,resu){});
				
			}
		}
		
		//delete all event transactions 
		await Admintransaction.deleteMany({event_id: eventId},function(err,resu){});
	} */
	
    //Userbet.find({team_name:winTeamName,event_id: eventId,type:'match',status:'pending',bet_on:{ $in: [ 'odds', 'bookmaker' ] }},function (e, result) { 
    var result = await Userbet.find({event_id: eventId,type:'match',status:'pending',bet_on:{ $in: [ 'odds', 'bookmaker' ] }},function (e, result) {    }) ; 
     //console.log("win");
		
	   
		if(result.length!=0){
			var transArr = [];
			var profitLossAmt  = 0;
			for(i=0;i<result.length;i++){
				//console.log("=============LOOP START========================================");
				var singleRecord = result[i];
				var eventId = singleRecord.event_id;
				var betType = singleRecord.bet_type;
				var userbet_id = singleRecord._id;
				//var profitLossAmt = singleRecord.profit;
				var userId = singleRecord.user_id;
				var team_name = singleRecord.team_name;
				var profitType = "loss";
				var profitLossAmt = 0;
				if(team_name.toLowerCase()==winner.toLowerCase()) {
					profitType = (betType=="back") ? 'profit' : "loss";
					profitLossAmt = (betType=="back") ? (singleRecord.odds -1)*singleRecord.stake : singleRecord.stake;
					//profitLossAmt = (singleRecord.odds -1)*singleRecord.stake
				}
				else {
					profitType = (betType=="back") ? 'loss' : "profit";
					profitLossAmt = (betType=="back") ? (singleRecord.odds -1)*singleRecord.stake : singleRecord.stake;
					//profitLossAmt = singleRecord.stake;
				}
				//console.log("Loop DATA CONSOLE START");
				// console.log("userId>>>>>>>>"+userId);
				//console.log("profitLossAmt>>>>>>>>"+profitLossAmt);
				//console.log("userbet_id>>>>>>>>"+userbet_id);
			//	console.log("profitType>>>>>>>>"+profitType);
			//	console.log("eventId>>>>>>>>"+eventId);
			//	 console.log("Loop DATA CONSOLE END");
				if(winner.toLowerCase()!='tie') {
					addProfitLossToUser(userId,profitLossAmt,userbet_id,profitType,eventId,sportType);
				}
				Userbet.updateOne({_id: new ObjectId(userbet_id)}, {$set: { status: 'completed' }}, {upsert: true},function(err,resu){});
				//console.log("=============LOOP END========================================");
			}
		}
		// delete unmatch bets 
		 Userbet.deleteMany({event_id: eventId,type:'unmatch',bet_on:{ $in: [ 'odds', 'bookmaker' ] },status:'pending'},function(err,resu){});
 
	
	/* Userbet.deleteMany({team_name:winTeamName,event_id: eventId,type:'unmatch',bet_on:{ $in: [ 'odds', 'bookmaker' ] },status:'pending'},function(err,resu){});
	Userbet.deleteMany({team_name:looseTeamName,event_id: eventId,type:'unmatch',bet_on:{ $in: [ 'odds', 'bookmaker' ] },status:'pending'},function(err,resu){});

	Userbet.find({team_name:looseTeamName,event_id: eventId,type:'match',status:'pending',bet_on:{ $in: [ 'odds', 'bookmaker' ] }},function (e, result) { 
			////console.log("loss");
			////console.log(result);
		if(result.length!=0){
			var transArr = [];
			var profitLossAmt  = 0;
			for(i=0;i<result.length;i++){
				var singleRecord = result[i];
				var eventId = singleRecord.event_id;
				var betType = singleRecord.bet_type;
				var userbet_id = singleRecord._id;
				var userId = singleRecord.user_id;
				var profitType = (betType=="back") ? 'loss' : "profit";
				
				var profitLossAmt = singleRecord.stake;
				addProfitLossToUser(userId,profitLossAmt,userbet_id,profitType,eventId,sportType);
				Userbet.updateOne({_id: new ObjectId(userbet_id)},{$set: { status: 'completed'}}, {upsert: true},function(err,resu){});
			}
		}
	 
    }) ;  */
	
	return true;
}


async function addProfitLossToUser(userId,profitLossAmount,userbet_id,profitLossType,eventId,sportType,profitLossPercent=0){
	console.log("addProfitLossToUser DATA CONSOLE ");
	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
		console.log("userId==========>"+userId);
		console.log("profitLossAmount==========>"+profitLossAmount);
		console.log("profitLossAmount==========>"+profitLossType);
	console.log("userbet_id==========>"+userbet_id);
		console.log("userbet_id==========>"+sportType);
		console.log("eventId==========>"+eventId);
		console.log("profitLossPercent==========>"+profitLossPercent);
		 var result = await User.findById(userId); 
				
				
					var parentProfitLossPercent = 0;
					if(sportType=="cricket") {
						var parentProfitLossPercent = result.cricket_partnership_own;
					}
					else if(sportType=="tennis") {
						var parentProfitLossPercent = result.tennis_partnership_own;
					}
					else if(sportType=="soccer") {
						var parentProfitLossPercent = result.football_partnership_own;
					}
					var userProfitLossAmount =  (result.userType==6) ? profitLossAmount : profitLossAmount*profitLossPercent/100;
					var remainingProfiltLossAmount = profitLossAmount;
					console.log("userProfitLossAmount==========>"+userProfitLossAmount);
					var nextProfitLossType = (result.userType==6) ? "loss" : "profit";
					var newTransobj = new Admintransaction();
					newTransobj.user_id = new Object(userId);
					newTransobj.userbet_id = new Object(userbet_id);
					newTransobj.trans_type = 'deposit';
					newTransobj.remark = 'profit';
					newTransobj.event_id = eventId;
					
					if(profitLossType=="loss"){
						userProfitLossAmount = -userProfitLossAmount; 
						newTransobj.trans_type = 'withdrawal';
						newTransobj.remark = 'loss';
						nextProfitLossType = result.userType==6 ? "profit" : "loss";
					}
					newTransobj.amount = userProfitLossAmount;
					 //console.log("admin tranasction data");
					//console.log(newTransobj);
					if(await newTransobj.save()){
						var getNewResult = await User.findById(userId); 
						
						if(getNewResult!=null) {
							console.log("userId>>>>>>"+userId);
							console.log("BeforeUserProfitLossAmount >>>>"+userProfitLossAmount);
							userProfitLossAmount = userProfitLossAmount + getNewResult.profit_loss;
							
							console.log("getNewResult.profit_loss >>>>"+getNewResult.profit_loss);
							console.log("userProfitLossAmount >>>>"+userProfitLossAmount);
							
							
							await User.updateOne({_id: new ObjectId(userId)}, { $set:{ profit_loss: userProfitLossAmount }}, {upsert: true},function(err,resu){
								
									console.log(err);
									console.log(resu);
								
							});
						}
						
				
						
						
						if(result.parentid!=null && result.parentid!="" && result.parentid!=undefined){
							return addProfitLossToUser(result.parentid,remainingProfiltLossAmount,userbet_id,nextProfitLossType,eventId,sportType,parentProfitLossPercent)
						}
						else {
							return 1;
						}
					}
					else {
							return 1;
						}
					
		
	
	
}



 async function fancy_result_rollback(req,res) {
	 /* res.json({ success: true, message: 'Fancy result rollback successfully',req:req.body });
	 return true; */
	 var eventId = parseInt(req.body.event_id);
	 var fancyName = req.body.headname;
	 
	 var getMatchDetails = await Manualmatch.findOne({match_id:eventId});
	 
	 // update matchlist 
	 Fancylist.updateOne({event_id: eventId,fancy_name:fancyName}, { $set:{ result_declare: "no" }}, {upsert: true},function(err,resu){});
	 
	
	 // set uset sets to pending
		await Userbet.updateMany({event_id: eventId,headname: fancyName,bet_on: 'fancy'}, {$set: { status: 'pending' }}, {upsert: true},function(err,resu){ });
		
		
		var getAllBets = await Userbet.find({event_id: eventId,headname: fancyName,bet_on: 'fancy'});
		// get all event transactions
		if(getAllBets.length>0){
			for(j=0;j<getAllBets.length;j++){
				var getUserBetId = getAllBets[j]._id;
				var allEventTransactions = await Admintransaction.find({event_id: eventId,userbet_id:getUserBetId});
				//set user profilt loss to prevous state
				if(allEventTransactions.length>0){
					for(i=0;i<allEventTransactions.length;i++){
						var getData = allEventTransactions[i];
						var profitLossAmt = getData.amount;
						var userId = getData.user_id;
						if(profitLossAmt>0){
							profitLossAmt = -profitLossAmt;
						}
						else {
							profitLossAmt = Math.abs(profitLossAmt);
						}
						const userData = await User.findById(userId); 
						
						profitLossAmt = profitLossAmt + userData.profit_loss;
						
						await User.updateOne({_id: new ObjectId(userId)}, { $set:{ profit_loss: profitLossAmt} }, {upsert: true},function(err,resu){});
						
					}
				}
				
				//delete all event transactions 
				await Admintransaction.deleteOne({event_id: eventId,userbet_id:getUserBetId},function(err,resu){});
			}
		}
		
		res.json({ success: true, message: 'Fancy result rollback successfully' });
 }



 async function result_rollback(req,res) {
	 var eventId = parseInt(req.params.eventid);
	 
	 var getMatchDetails = await Manualmatch.findOne({match_id:eventId});
	 
	 // update matchlist 
	 Matchlist.updateOne({match_id: eventId}, { $set:{ result_declare: "no" }}, {upsert: true},function(err,resu){});
	 
	  // update matchlist
	 Manualmatch.updateOne({match_id: eventId}, { $set:{result_declare: "no" }}, {upsert: true},function(err,resu){});
	 
	 // set uset sets to pending
		await Userbet.updateMany({event_id: eventId,bet_on:{ $in: [ 'odds', 'bookmaker' ] }}, {$set: { status: 'pending' }}, {upsert: true},function(err,resu){ });
		
		
		var getAllBets = await Userbet.find({event_id: eventId,bet_on:{ $in: [ 'odds', 'bookmaker' ] }});
		// get all event transactions
		if(getAllBets.length>0){
			for(j=0;j<getAllBets.length;j++){
				var getUserBetId = getAllBets[j]._id;
				var allEventTransactions = await Admintransaction.find({event_id: eventId,userbet_id:getUserBetId});
				//set user profilt loss to prevous state
				if(allEventTransactions.length>0){
					for(i=0;i<allEventTransactions.length;i++){
						var getData = allEventTransactions[i];
						var profitLossAmt = getData.amount;
						var userId = getData.user_id;
						if(profitLossAmt>0){
							profitLossAmt = -profitLossAmt;
						}
						else {
							profitLossAmt = Math.abs(profitLossAmt);
						}
						const userData = await User.findById(userId); 
						
						profitLossAmt = profitLossAmt + userData.profit_loss;
						
						await User.updateOne({_id: new ObjectId(userId)}, { $set:{ profit_loss: profitLossAmt} }, {upsert: true},function(err,resu){});
						
					}
				}
				
				//delete all event transactions 
				await Admintransaction.deleteOne({event_id: eventId,userbet_id:getUserBetId},function(err,resu){});
			}
		}
		
		res.json({ success: true, message: 'Match result rollback successfully' });
 }




async function setMatchWinnerByAdmin(req,res){
	/* var currentUserId = req.user.sub;
	
	const user = await User.findById(currentUserId);  
    if (!user) {
		res.json({ success: false, message: 'User Not Found' });
	}
	else { */
		var eventId = parseInt(req.body.event_id);
	/* 	var firstTeamName = req.body.first_team;
		var secondTeamName = req.body.second_team; */
		var winner = req.body.selectedOption;
		
		/* var winnerTeamSelectionId = req.body.win_team_name;
		var looserTeamSelectionId = req.body.looser_team;
		var sportType = req.body.sport_type;
		 */
		var getMatchDetails = await Manualmatch.findOne({match_id:eventId});
		console.log(getMatchDetails);
		var sportType = getMatchDetails.sport_type;
		var findMatchExist = await Matchlist.find({match_id:eventId});
		if(findMatchExist!=null && findMatchExist.length>0){
			Matchlist.updateOne({match_id: eventId}, { $set:{ winner_name: winner,result_declare: "yes" }}, {upsert: true},function(err,resu){});
		}
		else {
			
			  
				var newTransobj = {};
				
				newTransobj.match_id = eventId;
				newTransobj.market_id = "1."+eventId;
				newTransobj.open_date = getMatchDetails.open_date;
				newTransobj.match_name = getMatchDetails.match_name;
				newTransobj.winner = winner;
				newTransobj.sport_type = sportType;
				newTransobj.result_declare = 'yes';
				Matchlist.insertMany(newTransobj,function(err,resu){
					
				});
		}
		Manualmatch.updateOne({match_id: eventId}, { $set:{result_declare: "yes" }}, {upsert: true},function(err,resu){});
		
		matchResult(winner,eventId,sportType,false);
/* 
		var transArr = [];
		var newTransobj = {};

		newTransobj.event_id = req.body.event_id;
		newTransobj.win_team_selectionid = req.body.win_team;
		newTransobj.loss_team_selectionid = req.body.looser_id;
		newTransobj.win_team = req.body.win_team_name;
		newTransobj.looser_team = req.body.looser_team;
		newTransobj.sport_type = req.body.sport_type;
		
		transArr.push(newTransobj);

		Matchdeclare.insertMany(newTransobj,function(err,resu){});
 */		res.json({ success: true, message: 'Winner set successfully' });
	//}
	
}



async function setFancyResultByAdmin(req,res){
	var eventId = req.body.event_id;
	var headname = req.body.headname;
	var score = req.body.score;
	var sportType="cricket";
	FancyResult(headname,score,eventId,sportType);
	Fancylist.updateOne({fancy_name: headname,event_id:eventId}, { $set:{result_declare: "yes" }}, {upsert: true},function(err,resu){
		if(err!=null){
			res.json({ success: false, message: 'unable to declare result',err:err });
		}
		else {
			res.json({ success: true, message: 'Fancy result declare successfully',resu:resu });
		}
	});
	
}



async function SuspendData(req,res){

	var transArr = [];
	
	
	
	
		Suspend.findOne({event_id:req.body.event_id},function(err,resu){
			if(resu!=undefined && resu!=null){
				if(resu.length==0){
					var matchdata = new Suspend();
					matchdata.event_id =req.body.event_id;
					matchdata.status =1;
					matchdata.save();
					Suspend.insertMany(newTransobj,function(err,resu){
						res.json({ success: true, message: 'Suspend set successfully' });
				});
				}else{
					
					if(resu.status==1){
						
						
						Suspend.updateOne({event_id:req.body.event_id}, {$set: { status: 0 }}, {upsert: true},function(err,resu){
							
						});
						res.json({ success: true, message: 'Un-Uspend set successfully' });
	
					}else{
						Suspend.updateOne({event_id:req.body.event_id}, {$set: { status: 1 }}, {upsert: true},function(err,resu){
							
						});
						res.json({ success: true, message: 'Suspend set successfully' });
	
					}
				}
			}else{
				
				var matchdata = new Suspend();
					matchdata.event_id =req.body.event_id;
					matchdata.status =1;
					matchdata.save();
					res.json({ success: true, message: 'Suspend set successfully' });
			}
			
				


		});
		
	







	
	
		
	//}
	
}



async function setMatchWinnerByApi(req,res){
	var eventId = req.body.eventId;
	var win_team_name = req.body.win_team_name;
	var looser_team = req.body.looser_team;
	matchResult(win_team_name,looser_team,eventId,null);
	var transArr = [];
		var newTransobj = {};
					//newTransobj.user_id = new Object(userId);
					//newTransobj.userbet_id = new Object(userbet_id);
					newTransobj.event_id = req.body.event_id;
					//newTransobj.win_team_selectionid = req.body.winner_selection_id;
					//newTransobj.loss_team_selectionid = req.body.looser_selection_id
					newTransobj.win_team = req.body.win_team_name;
					newTransobj.looser_team = req.body.looser_team;
					newTransobj.sport_type = req.body.sport_type;
					newTransobj.winner_by_api = 1;
					//newTransobj.market_id = req.body.market_id
					
					
					transArr.push(newTransobj);

					Matchdeclare.insertMany(newTransobj,function(err,resu){
					
				});
	res.json({ success: true, message: 'Winner set successfully' });
	
	
}

async function casinoresultdt20(req,res){
	var matchId = req.params.matchid;
	
	var axios = require('axios');

	var config = {
	  method: 'get',
	  url: 'https://firestorenew-da5f7.firebaseio.com/DTT20Data/result.json',
	  headers: { 
		'Cookie': 'XSRF-TOKEN=eyJpdiI6IjU2YURwNmxneEVwSVZhcmttcTFSRGc9PSIsInZhbHVlIjoicXQzZUxpaHFXU1pmMlJkSFNjQkU5ajBmVnlhcHZUTTFXM2QwNkpNRzVBYVBkdjMrWGZ4czc1S3ZSNHYyZ1lNcSIsIm1hYyI6Ijc3YjgwOTUzZjVmYzU4NjliMzM4YWE5M2VlZTAyMGJlMzlhN2EyZjQ3ZTVhMGVmMzI4ZmUwZjg0ZTVjZmE1MTYifQ%3D%3D; laravel_session=eyJpdiI6IjBoUTRkVzUwbFBjZVBlOHpkUTlMK3c9PSIsInZhbHVlIjoicll5OXFQOWhzUzVtNTJ0V21rd09DUTFcL3ljQkVGdW5mbVVBWVwvMjdBUHlXQ2NjcVVWTlJPcGZVWktONEdjUmdyIiwibWFjIjoiMTNmMDdjNTQ4MDljODJjOWE3YjJkMmRhNWE1YjhhYzA3ODdkZTlhNGQxOTE3MGUxYzM4MWQ1NmRjOTM5ZjVjNSJ9'
	  },
	  httpsAgent: new https.Agent({
			rejectUnauthorized: false
		}),
	};

	var getData = await axios(config)
	.then(function (response) {
	  return  response.data.data;
	});

		
	res.json({"success":true,"message":"fancy data","alldata":getData}) 	
}




function casinoresultteenpati(req, res) {
	//////////////console.log(req.params.id);
    Userbet.find({user_id:new Object(req.user.sub),casnio_type:"unmatch",event_type:"onedayteenpatti"},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}

function casino_dt_one_day(req, res) {
	//////////////console.log(req.params.id);
    Userbet.find({user_id:new Object(req.user.sub),casnio_type:"unmatch",event_type:"dtoneday"},function (e, result) { 
        if (e) {
            res.json({ success: false, message: 'No Bat found' })
        } else {
            res.json({ success: true, message: 'User Bet list', Betlist: result })
        } 
    }) ;    
}
async function usercasinodeatils(req, res) {
	var arr1 =[];
		var arr=await User.find({parentid:req.user.sub});
		for(var j=0;j<arr.length;j++){
			var data=await	Userbet.find({user_id:new ObjectId(arr[j]._id),casnio_type:"unmatch",event_type:req.params.id}, function (e, result) { 
			}).populate('user_id');
			
			arr1.push(data);
		}
    res.json({ success: true, message: 'sucess', data: arr1 })


}



async function casinoresultunmatchtomatch(req, res){
	var axios = require('axios');

	var config = {
	  method: 'get',
	  url: 'http://cashinoapi.herokuapp.com/bmwexch/teen',
	  headers: { 
		'Cookie': 'XSRF-TOKEN=eyJpdiI6IjU2YURwNmxneEVwSVZhcmttcTFSRGc9PSIsInZhbHVlIjoicXQzZUxpaHFXU1pmMlJkSFNjQkU5ajBmVnlhcHZUTTFXM2QwNkpNRzVBYVBkdjMrWGZ4czc1S3ZSNHYyZ1lNcSIsIm1hYyI6Ijc3YjgwOTUzZjVmYzU4NjliMzM4YWE5M2VlZTAyMGJlMzlhN2EyZjQ3ZTVhMGVmMzI4ZmUwZjg0ZTVjZmE1MTYifQ%3D%3D; laravel_session=eyJpdiI6IjBoUTRkVzUwbFBjZVBlOHpkUTlMK3c9PSIsInZhbHVlIjoicll5OXFQOWhzUzVtNTJ0V21rd09DUTFcL3ljQkVGdW5mbVVBWVwvMjdBUHlXQ2NjcVVWTlJPcGZVWktONEdjUmdyIiwibWFjIjoiMTNmMDdjNTQ4MDljODJjOWE3YjJkMmRhNWE1YjhhYzA3ODdkZTlhNGQxOTE3MGUxYzM4MWQ1NmRjOTM5ZjVjNSJ9'
	  },
	  httpsAgent: new https.Agent({
			rejectUnauthorized: false
		}),
	};

	var getData = await axios(config)
	.then(function (response) {
	  return  response.data.result;
	});
	
	if(getData.data.length>0){
		for(var index=0;index<getData.data.length;index++){
			
		var dataCasinobet=	await Userbet.find({casnio_type:"unmatch",event_type:"onedayteenpatti",event_id:getData.data[index].mid,},function (e, result) {}) ;
			if(dataCasinobet!=undefined){
				for(var index2=0;index2<dataCasinobet.length;index2++){
					Userbet.updateOne({_id: new ObjectId(dataCasinobet[index]._id)}, {$set: { status: 'completed',casnio_type:"match" }}, {upsert: true},function(err,resu){
						
					});
					var win="";
					if(dataCasinobet[index2].team_name=="Player A"){
						win ="1";
					}
					if(dataCasinobet[index2].team_name=="Player B"){
						win ="2";
					}


					var profitType="";
					if(getData.data[index].mid==dataCasinobet[index2].event_id)
					if(getData.data[index].result==win){
						profitType ="profit";
					}else{
						profitType ="loss";
					}
						
				
					addProfitLossToUser(dataCasinobet[index2].user_id,dataCasinobet[index2].stake,dataCasinobet[index2]._id,profitType,dataCasinobet[index2].event_id);
				}
			}
		}
		res.json({ success: true, message: 'Sucess',  })

	}
}

async function worli2_result(req, res){
	var axios = require('axios');

	var config = {
	  method: 'get',
	  url: 'http://cashinoapi.herokuapp.com/bmwexch/worli2',
	  headers: { 
		'Cookie': 'XSRF-TOKEN=eyJpdiI6IjU2YURwNmxneEVwSVZhcmttcTFSRGc9PSIsInZhbHVlIjoicXQzZUxpaHFXU1pmMlJkSFNjQkU5ajBmVnlhcHZUTTFXM2QwNkpNRzVBYVBkdjMrWGZ4czc1S3ZSNHYyZ1lNcSIsIm1hYyI6Ijc3YjgwOTUzZjVmYzU4NjliMzM4YWE5M2VlZTAyMGJlMzlhN2EyZjQ3ZTVhMGVmMzI4ZmUwZjg0ZTVjZmE1MTYifQ%3D%3D; laravel_session=eyJpdiI6IjBoUTRkVzUwbFBjZVBlOHpkUTlMK3c9PSIsInZhbHVlIjoicll5OXFQOWhzUzVtNTJ0V21rd09DUTFcL3ljQkVGdW5mbVVBWVwvMjdBUHlXQ2NjcVVWTlJPcGZVWktONEdjUmdyIiwibWFjIjoiMTNmMDdjNTQ4MDljODJjOWE3YjJkMmRhNWE1YjhhYzA3ODdkZTlhNGQxOTE3MGUxYzM4MWQ1NmRjOTM5ZjVjNSJ9'
	  },
	  httpsAgent: new https.Agent({
			rejectUnauthorized: false
		}),
	};

	var getData = await axios(config)
	.then(function (response) {
	  return  response.data.result;
	});
	
	if(getData.data.length>0){
		for(var index=0;index<getData.data.length;index++){
			
		var dataCasinobet=	await Userbet.find({casnio_type:"unmatch",event_type:"worli2",event_id:getData.data[index].mid,},function (e, result) {}) ;
			if(dataCasinobet!=undefined){
				for(var index2=0;index2<dataCasinobet.length;index2++){
					Userbet.updateOne({_id: new ObjectId(dataCasinobet[index]._id)}, {$set: { status: 'completed',casnio_type:"match" }}, {upsert: true},function(err,resu){
						
					});
					var win="";
					if(dataCasinobet[index2].team_name=="0 Single"){
						win ="0";
					}
					if(dataCasinobet[index2].team_name=="1 Single"){
						win ="1";
					}
					if(dataCasinobet[index2].team_name=="2 Single"){
						win ="2";
					}
					if(dataCasinobet[index2].team_name=="3 Single"){
						win ="3";
					}
					if(dataCasinobet[index2].team_name=="4 Single"){
						win ="4";
					}
					if(dataCasinobet[index2].team_name=="5 Single"){
						win ="5";
					}
					if(dataCasinobet[index2].team_name=="5 Single"){
						win ="5";
					}if(dataCasinobet[index2].team_name=="6 Single"){
						win ="6";
					}

					if(dataCasinobet[index2].team_name=="7 Single"){
						win ="5";
					}
					if(dataCasinobet[index2].team_name=="7 Single"){
						win ="7";
					}

					if(dataCasinobet[index2].team_name=="8 Single"){
						win ="8";
					}
					if(dataCasinobet[index2].team_name=="9 Single"){
						win ="9";
					}
					
					if(dataCasinobet[index2].team_name=="Line 1"){
						win ="11";
					}
					if(dataCasinobet[index2].team_name=="ODD"){
						win ="12";
					}
					if(dataCasinobet[index2].team_name=="Line 2"){
						win ="13";
					}
					if(dataCasinobet[index2].team_name=="Even"){
						win ="14";
					}

					
					var profitType="";
					if(getData.data[index].mid==dataCasinobet[index2].event_id)
					if(getData.data[index].result==win){
						profitType ="profit";
					}else{
						profitType ="loss";
					}
						
				
					addProfitLossToUser(dataCasinobet[index2].user_id,dataCasinobet[index2].stake,dataCasinobet[index2]._id,profitType,dataCasinobet[index2].event_id);
				}
			}
		}
		res.json({ success: true, message: 'Sucess',  })

	}
}
async function card32_result(req, res){
	var axios = require('axios');

	var config = {
	  method: 'get',
	  url: 'http://cashinoapi.herokuapp.com/bmwexch/card32',
	  headers: { 
		'Cookie': 'XSRF-TOKEN=eyJpdiI6IjU2YURwNmxneEVwSVZhcmttcTFSRGc9PSIsInZhbHVlIjoicXQzZUxpaHFXU1pmMlJkSFNjQkU5ajBmVnlhcHZUTTFXM2QwNkpNRzVBYVBkdjMrWGZ4czc1S3ZSNHYyZ1lNcSIsIm1hYyI6Ijc3YjgwOTUzZjVmYzU4NjliMzM4YWE5M2VlZTAyMGJlMzlhN2EyZjQ3ZTVhMGVmMzI4ZmUwZjg0ZTVjZmE1MTYifQ%3D%3D; laravel_session=eyJpdiI6IjBoUTRkVzUwbFBjZVBlOHpkUTlMK3c9PSIsInZhbHVlIjoicll5OXFQOWhzUzVtNTJ0V21rd09DUTFcL3ljQkVGdW5mbVVBWVwvMjdBUHlXQ2NjcVVWTlJPcGZVWktONEdjUmdyIiwibWFjIjoiMTNmMDdjNTQ4MDljODJjOWE3YjJkMmRhNWE1YjhhYzA3ODdkZTlhNGQxOTE3MGUxYzM4MWQ1NmRjOTM5ZjVjNSJ9'
	  },
	  httpsAgent: new https.Agent({
			rejectUnauthorized: false
		}),
	};

	var getData = await axios(config)
	.then(function (response) {
	  return  response.data.result;
	});
	
	if(getData.data.length>0){
		for(var index=0;index<getData.data.length;index++){
			
		var dataCasinobet=	await Userbet.find({casnio_type:"unmatch",event_type:"card32a",event_id:getData.data[index].mid,},function (e, result) {}) ;
			if(dataCasinobet!=undefined){
				for(var index2=0;index2<dataCasinobet.length;index2++){
					Userbet.updateOne({_id: new ObjectId(dataCasinobet[index]._id)}, {$set: { status: 'completed',casnio_type:"match" }}, {upsert: true},function(err,resu){
						
					});
					var win="";
					if(dataCasinobet[index2].team_name=="Player 8"){
						win ="1";
					}
					if(dataCasinobet[index2].team_name=="Player 9"){
						win ="2";
					}
					if(dataCasinobet[index2].team_name=="Player 10"){
						win ="3";
					}
					if(dataCasinobet[index2].team_name=="Player 11"){
						win ="4";
					}
					
					
					
					var profitType="";
					if(getData.data[index].mid==dataCasinobet[index2].event_id)
					if(getData.data[index].result==win){
						profitType ="profit";
					}else{
						profitType ="loss";
					}
						
				
					addProfitLossToUser(dataCasinobet[index2].user_id,dataCasinobet[index2].stake,dataCasinobet[index2]._id,profitType,dataCasinobet[index2].event_id);
				}
			}
		}
		res.json({ success: true, message: 'Sucess',  })

	}
}


////////////////////

async function lucky7b_result(req, res){
	var axios = require('axios');

	var config = {
	  method: 'get',
	  url: 'http://diamondhpexch.herokuapp.com/lordsexch/lucky7eu',
	  headers: { 
		'Cookie': 'XSRF-TOKEN=eyJpdiI6IjU2YURwNmxneEVwSVZhcmttcTFSRGc9PSIsInZhbHVlIjoicXQzZUxpaHFXU1pmMlJkSFNjQkU5ajBmVnlhcHZUTTFXM2QwNkpNRzVBYVBkdjMrWGZ4czc1S3ZSNHYyZ1lNcSIsIm1hYyI6Ijc3YjgwOTUzZjVmYzU4NjliMzM4YWE5M2VlZTAyMGJlMzlhN2EyZjQ3ZTVhMGVmMzI4ZmUwZjg0ZTVjZmE1MTYifQ%3D%3D; laravel_session=eyJpdiI6IjBoUTRkVzUwbFBjZVBlOHpkUTlMK3c9PSIsInZhbHVlIjoicll5OXFQOWhzUzVtNTJ0V21rd09DUTFcL3ljQkVGdW5mbVVBWVwvMjdBUHlXQ2NjcVVWTlJPcGZVWktONEdjUmdyIiwibWFjIjoiMTNmMDdjNTQ4MDljODJjOWE3YjJkMmRhNWE1YjhhYzA3ODdkZTlhNGQxOTE3MGUxYzM4MWQ1NmRjOTM5ZjVjNSJ9'
	  },
	  httpsAgent: new https.Agent({
			rejectUnauthorized: false
		}),
	};

	var getData = await axios(config)
	.then(function (response) {
	  return  response.data.result;
	});
	console.log(getData.data);
	return false;
	if(getData.data.length>0){
		for(var index=0;index<getData.data.length;index++){
			
		var dataCasinobet=	await Userbet.find({casnio_type:"unmatch",event_type:"luckysevenb",event_id:getData.data[index].mid,},function (e, result) {}) ;
			if(dataCasinobet!=undefined){
				for(var index2=0;index2<dataCasinobet.length;index2++){
					Userbet.updateOne({_id: new ObjectId(dataCasinobet[index]._id)}, {$set: { status: 'completed',casnio_type:"match" }}, {upsert: true},function(err,resu){
						
					});
					var win="";
					if(dataCasinobet[index2].team_name=="HIGH Card"){
						win ="1";
					}
					if(dataCasinobet[index2].team_name=="LOW Card"){
						win ="2";
					}
					
					
					
					
					var profitType="";
					if(getData.data[index].mid==dataCasinobet[index2].event_id)
					if(getData.data[index].result==win){
						profitType ="profit";
					}else{
						profitType ="loss";
					}
						
				
					addProfitLossToUser(dataCasinobet[index2].user_id,dataCasinobet[index2].stake,dataCasinobet[index2]._id,profitType,dataCasinobet[index2].event_id);
				}
			}
		}
		res.json({ success: true, message: 'Sucess',  })

	}
}
