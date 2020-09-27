const express = require("express");
const http = require("http");
const https = require('https');
const socketIo = require("socket.io");
const path = require('path'); 
var axios = require('axios');

var ObjectId = require('mongoose').Types.ObjectId; 
path1 = path.resolve("_helpers/db"); 

console.log(path1);
const db = require(path1);
const port = process.env.PORT || 4004;

const app = express();

const server = http.createServer(app);

const io = socketIo(server);
const Matchdata = db.Matchdata; 
const Suspend = db.Suspend; 
const Buttonvalue = db.Buttonvalue; 
const Matchlist = db.Matchlist; 
const Oods = db.Oods; 
const Userbet = db.Userbet;
const Hidematcheslist = db.Hidematcheslist;
const Fancylist = db.Fancylist;
const Manualmatch = db.Manualmatch; 
let interval;




io.on("connection", (socket) => {
//   if (interval) {
//     clearInterval(interval);
//   }
  let match_id = socket.handshake.query['match_id'];
let sport_type = socket.handshake.query['sport_type'];
  interval = setInterval(() => getApiAndEmit3(socket,match_id,sport_type), 1000);

//   socket.on("disconnect", () => {
//    // console.log("Client disconnected");
//     clearInterval(interval);
//   });
});



 const getApiAndEmit3 = async (socket, match_id,sport_type) => {
	
	var matchId = match_id;
	var myarr=[];
	var newdata =[];
		var axios = require('axios');
		var getSuspendData = await Suspend.findOne({event_id:matchId});
		var isSuspended = (getSuspendData==null) ? 0 : getSuspendData.status;
		
		var ManualmatchDetail = await Manualmatch.findOne({match_id:matchId});
		var unmatchOddStatus = (ManualmatchDetail==null ||  ManualmatchDetail.unmatch_bet==undefined ) ? 'enable' : ManualmatchDetail.unmatch_bet;
		
		var getFancyInActiveList = await Fancylist.find({event_id:matchId,is_active:"no"}).select("fancy_name");
		var getFancyInActiveListArr = [];
		for(var a=0;a<getFancyInActiveList.length;a++){
			getFancyInActiveListArr.push(getFancyInActiveList[a].fancy_name);
		}
		
		
		var getFancySuspendList = await Fancylist.find({event_id:matchId,is_suspended:"yes"}).select("fancy_name");
		var getFancySuspendListtArr = [];
		for(var b=0;b<getFancySuspendList.length;b++){
			getFancySuspendListtArr.push(getFancySuspendList[b].fancy_name);
		}
		
		var getHideMatchData = await Hidematcheslist.findOne({event_id:matchId});
		var isMatchHide = (getHideMatchData==null) ? "no" : "yes";
	
	var getMatchData = await Matchdata.find({match_id:matchId});
	var tvStatus = (getMatchData.status_tv==undefined || getMatchData.status_tv=="") ? 0 :getMatchData.status_tv;
	
	if(isMatchHide=="yes"){
		socket.emit("FromAPI4", {  success: false, message: 'No Data found',data:[],data1:[],bookmaker:[],suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData,fancyInActiveList:getFancyInActiveListArr,fancySuspendList:getFancySuspendListtArr,unmatchOddStatus:unmatchOddStatus });
		return true;
	}
	  
			
	   var axios = require('axios');
	   
	   var config = {
		 method: 'get',
		 url: 'http://172.105.37.187/json/1.'+match_id+'.json',
		 headers: { 
		   'key': 'D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9', 
		   'Content-Type': 'application/json', 
		   'Cookie': 'XSRF-TOKEN=eyJpdiI6IkpibzE5akRzV0tGUWpcL25XamZ5RjR3PT0iLCJ2YWx1ZSI6ImhzZEhcL1lINHpPSEhPaUxvVXhvU0gybWtET1hUa2Z3Ym5hZVczdHhzQnhObUpHVFB2cFBPNTRhVFVUUVhZYlNHIiwibWFjIjoiOWU1YmVmNjAxYTU4ZDI0ZTRkMDQzZTcwZmYxNDM5MTE0NDUwNDk3YWRjNGRiNzYzNDE5NDE2NThhNDlmMTliOCJ9; laravel_session=eyJpdiI6IkxEdE1paUJPQ1paa3NjYXA4UXBORHc9PSIsInZhbHVlIjoiemFudzBQZmhLTWdKXC9kd2d0OFwvNFwveXUxa1FsNFZaeThrckZZbzg3SUNTODBBUUN5VkJBYTJLcm0rbk9lcU9vbSIsIm1hYyI6ImI2ZjYyNjk3MTgzMzA0MDA5YTE2NmExZDY5MGExMjkzNzM1YTJkZTQzYjQzMjAyYWM1MjNlN2NmMDcyNjIzODYifQ%3D%3D'
		 },httpsAgent: new https.Agent({
			rejectUnauthorized: false
		  }),
		 };
	   
	   await  axios(config)
	   .then(async function (response2) {

		 if(response2!=undefined || response2!='' ||response2!=null ){
			//console.log(response2.data);
				
			
						//convertUnmatchToMatchCron(response2.data,matchId);
						  //////////////console.log(response.data.data.result);
						//    var Oods_data = new Oods();
						//    Oods_data.matchdata = {data:response2.data};
			  
						//   Oods_data.save();
						  
						//   const buttonvalue = await Buttonvalue.findOne({ "user_id": req.user.sub });
						
						  // convert Unmatch Bid into Match Bid
						  //convertUnmatchToMatchCron();
						  
						  //saveMatchToDb(newdata);
						  //console.log(response2.data.data.result);
		  
						  socket.emit("FromAPI4", { success: true, message: 'odds List',data:response2.data,data1:newdata,buttonvalue:[] ,suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData,fancyInActiveList:getFancyInActiveListArr,fancySuspendList:getFancySuspendListtArr ,unmatchOddStatus:unmatchOddStatus});
		  
						 return true;
		  
			} 
		 else {
			//console.log("2");
			// res.json({  success: false, message: 'No Data found',data:[],data1:[],bookmaker:[],suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData });
			socket.emit("FromAPI4", {  success: false, message: 'No Data found',data:[],data1:[],bookmaker:[],suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData,fancyInActiveList:getFancyInActiveListArr,fancySuspendList:getFancySuspendListtArr,unmatchOddStatus:unmatchOddStatus});
			return true;
		} 
		 
	   })
	   .catch(function (error) {
		console.log(error);
		//// res.json({ success: false, message: 'No Data found',data:[],data1:[] ,bookmaker:[],suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData});
		socket.emit("FromAPI4", {success: false, message: 'No Data found',data:[],data1:[] ,bookmaker:[],suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData,fancyInActiveList:getFancyInActiveListArr,fancySuspendList:getFancySuspendListtArr,unmatchOddStatus:unmatchOddStatus});
		return true;
	
	});
	   
	
  // Emitting a new message. Will be consumed by the client
 
};







async function convertUnmatchToMatchCron(matchDataArr,eventId){
	var marketId = "1."+eventId;
	
				
	 		if(matchDataArr!=null){
				
				// convert only match odds 
				 var MarketOddsArr = matchDataArr.market[0].events;
				 console.log("MarketOddsArr");
				
	 			 for(j=0;j<MarketOddsArr.length;j++){
					var matchSingleEvent = MarketOddsArr[j];
					var teamName = matchSingleEvent.RunnerName;
					var currentRateLay = matchSingleEvent.LayPrice1;
					var currentRateBack = matchSingleEvent.BackPrice1;
					
					
						
					
					var getUnMatchOddsBet = await Userbet.find({team_name: teamName,market_id: marketId,type:'unmatch',status:'pending',bet_on: { $in:['odds']}});
																
						if(getUnMatchOddsBet!=null && getUnMatchOddsBet.length>0){

							for(var a=0;a<getUnMatchOddsBet.length;a++){
								
								
								 console.log("currentRateLay>>>"+currentRateLay);
								console.log("currentRateBack>>>"+currentRateBack);
								
								var userBetData = getUnMatchOddsBet[a];
								var userBetId = userBetData._id;
								var userOdds = parseFloat(userBetData.odds);
								var userCurrentOdds = parseFloat(userBetData.current_market_odds);
								var newOddsValue = (userBetData.bet_type=='back') ? currentRateBack : currentRateLay;
								newOddsValue = parseFloat(newOddsValue);
								var userBetNewType = userBetData.type;
								console.log("userOdds>>>>>>>>>>>>>"+userOdds);
								console.log("userCurrentOdds>>>>>>>>>>>>>"+userCurrentOdds);
								console.log("newOddsValue>>>>>>>>>>>>>"+newOddsValue);
								
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
								
								if(userBetNewType=='match' && newOddsValue>0) {
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
					
					
				
					
						
					
					var getUnMatchOddsBet = await Userbet.find({team_name: teamName,market_id: marketId,type:'unmatch',status:'pending',bet_on: { $in:['bookmaker']}});
																	
						if(getUnMatchOddsBet!=null && getUnMatchOddsBet.length>0){
							
							for(var b=0;b<getUnMatchOddsBet.length;b++){
								
								var userBetData = getUnMatchOddsBet[b];
								var userBetId = userBetData._id;
								var userOdds = parseFloat(userBetData.odds);
								var userCurrentOdds = parseFloat(userBetData.current_market_odds);
								var newOddsValue = (userBetData.bet_type=='back') ? currentRateBack : currentRateLay;
								newOddsValue = parseFloat(newOddsValue);
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
								
								if(userBetNewType=='match' && newOddsValue>0) {
									 await Userbet.updateOne({_id: new ObjectId(userBetId)}, { $set:{ type: userBetNewType,matchDate:Date.now()} }, {upsert: true},function(err,resu){});
								}
								
							}
						}
						
					
	 			}		
					
					
			}	
					
			return 1;
			
}
// 
server.listen(port, () => console.log(`Listening on port ${port}`));
//async function 

// convertUnmatchToMatchCron(req,res){
// 	var allMatchData = [];
	
	
	
// 	 var getTotalStake =  await Userbet.aggregate([
// 		{ $match: {type:'unmatch',status:'pending',bet_type: { $not:{ $eq: "fancy" }}}}  ,
		 
// 		{
// 		  $group : {
// 			_id : "$market_id",
// 		}
// 		}
// 	  ]);
	 
// 	 var groupArr =  chunkArray(getTotalStake,10);
// 	 for(i=0;i<groupArr.length;i++){
// 		   var newArr = [];
// 		    for(j=0;j<groupArr[i].length;j++){
// 				newArr.push(groupArr[i][j]._id);
// 			}
// 			var data = JSON.stringify({"marketIds":newArr});
   
// 			var config = {
// 				method: 'post',
// 				url: 'https://bet247exch.com/odds',
// 				headers: { 
// 					'key': 'D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9', 
// 					'Content-Type': 'application/json', 
// 					'Cookie': 'XSRF-TOKEN=eyJpdiI6IkpibzE5akRzV0tGUWpcL25XamZ5RjR3PT0iLCJ2YWx1ZSI6ImhzZEhcL1lINHpPSEhPaUxvVXhvU0gybWtET1hUa2Z3Ym5hZVczdHhzQnhObUpHVFB2cFBPNTRhVFVUUVhZYlNHIiwibWFjIjoiOWU1YmVmNjAxYTU4ZDI0ZTRkMDQzZTcwZmYxNDM5MTE0NDUwNDk3YWRjNGRiNzYzNDE5NDE2NThhNDlmMTliOCJ9; laravel_session=eyJpdiI6IkxEdE1paUJPQ1paa3NjYXA4UXBORHc9PSIsInZhbHVlIjoiemFudzBQZmhLTWdKXC9kd2d0OFwvNFwveXUxa1FsNFZaeThrckZZbzg3SUNTODBBUUN5VkJBYTJLcm0rbk9lcU9vbSIsIm1hYyI6ImI2ZjYyNjk3MTgzMzA0MDA5YTE2NmExZDY5MGExMjkzNzM1YTJkZTQzYjQzMjAyYWM1MjNlN2NmMDcyNjIzODYifQ%3D%3D'
// 				},
// 				httpsAgent: new https.Agent({
// 					rejectUnauthorized: false
// 				}),
// 				data : data
// 		   };
		  
// 			var matchDataArr = await axios(config).then(function (response1) {
// 									return response1.data.data.result;
									
// 								})  
								
// 			 if(matchDataArr!=null){
			
// 				 for(let matchKey of Object.keys(matchDataArr)){
// 					  var matchDataArrSingle = matchDataArr[matchKey];
					
// 						var  values = matchDataArrSingle;
// 						var matchStatus =  values.status;
// 						var marketId = values.marketId; 
						
							
// 						for(var i=0;i<values.runners.length;i++){
// 							var selectionId = values.runners[i].selectionId;
// 							var currentRateBack = values.runners[i].ex.availableToBack[0].price;
// 							var currentRateLay = values.runners[i].ex.availableToLay[0].price;
// 							var getTeamStatus = values.runners[i].status;
// 							var getUnMatchOddsBet = await Userbet.find({selection_id: selectionId,type:'unmatch',status:'pending',bet_type: { $not:{ $eq: "fancy" }}});
							
							
// 							if(getUnMatchOddsBet!=null && getUnMatchOddsBet.length>0){
								
// 								for(var a=0;a<getUnMatchOddsBet.length;a++){
									
// 									var userBetData = getUnMatchOddsBet[a];
// 									var userBetId = userBetData._id;
// 									var userOdds = userBetData.odds;
// 									var userCurrentOdds = userBetData.current_market_odds;
// 									var newOddsValue = (userBetData.bet_type=='back') ? currentRateBack : currentRateLay;
// 									var userBetNewType = userBetData.type;
								
// 									if(newOddsValue > userBetData.current_market_odds){
// 										userBetNewType = (userOdds >=userCurrentOdds && userOdds <= newOddsValue) ? 'match' : userBetNewType;
// 									}
// 									else {
// 										userBetNewType = (userOdds >=newOddsValue && userOdds <= userCurrentOdds ) ? 'match' : userBetNewType;
// 									}
								
									
// 									if(userBetNewType=='match') {
// 										await Userbet.updateOne({_id: new ObjectId(userBetId)}, { $set:{ type: userBetNewType,matchDate:Date.now()} }, {upsert: true},function(err,resu){});
// 									}
									
// 								}
// 							}
							
// 						} 
// 					} 
// 			 }
// 		}
// 		return true;
// 	 	//res.json({"success":true,"message":"Match Hide Successfully"}) 	
			
// }
// function chunkArray(myArray, chunk_size){
//     var results = [];
    
//     while (myArray.length) {
//         results.push(myArray.splice(0, chunk_size));
//     }
    
//     return results;
// }

// async function saveMatchToDb(matchJsonData){
// 	//var convertToObj = JSON.parse(matchJsonData)[0];
// 	//console.log(matchJsonData);
	
// 	matchJsonData = matchJsonData[0];
// 	var sport_type="";
// 	if(matchJsonData.sport_id=='1'){
// 		sport_type="soccer";
// 	}
// 	else if(matchJsonData.sport_id=='2'){
// 		sport_type="tennis";
// 	}
// 	else if(matchJsonData.sport_id=='4'){
// 		sport_type="cricket";
// 	}
// 	var teamsData = JSON.parse(matchJsonData.teams);
// 	var firstRunner = teamsData.runners[0];
// 	var secondRunner = teamsData.runners[1];
	
// 	var newSaveObj = {    
// 		match_id: matchJsonData.match_id, 
// 		market_id: matchJsonData.market_id, 
// 		match_name: matchJsonData.match_name, 
// 		open_date: matchJsonData.open_date, 
// 		series_id:  matchJsonData.series_id,  
// 		series_name: matchJsonData.series_name, 
// 		sport_id: matchJsonData.sport_id,
// 		sport_type: sport_type
// 	}
// 	if(firstRunner.metadata!=undefined || secondRunner.metadata !=undefined){
// 		 Matchlist.findOne(newSaveObj,function(err,resp){
// 			if(resp==null){
// 				Matchlist.insertMany(newSaveObj,function(err,resp){
// 					//console.log(resp);
// 				});
// 			}
// 		}); 
// 	}
	
// 	/* Matchlist.insertMany(newSaveObj,function(err,resp){
		
// 	}); */
	
	

// }
