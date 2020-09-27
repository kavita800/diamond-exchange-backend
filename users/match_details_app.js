const express = require("express");
const http = require("http");
const https = require('https');
const socketIo = require("socket.io");
const path = require('path'); 
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
const Manualmatch = db.Manualmatch; 
let interval;




io.on("connection", (socket) => {
  if (interval) {
    clearInterval(interval);
  }
  let match_id = socket.handshake.query['match_id'];
let sport_type = socket.handshake.query['sport_type'];
  interval = setInterval(() => getApiAndEmit3(socket,match_id,sport_type), 1000);

  socket.on("disconnect", () => {
   // console.log("Client disconnected");
    clearInterval(interval);
  });
});



 const getApiAndEmit3 = async (socket, match_id,sport_type) => {
	
	var matchId = req.params.id;
	var myarr=[];
		var axios = require('axios');
		var getSuspendData = await Suspend.findOne({event_id:matchId});
		var isSuspended = (getSuspendData==null) ? 0 : getSuspendData.status;
		
		var isResultDeclareData = await Manualmatch.findOne({match_id:matchId,result_declare:'yes'});
		var isResultDeclare = (isResultDeclareData==null) ? 'no' : 'yes';
	

	
	var getMatchData = await Matchdata.find({match_id:matchId});
	var tvStatus = (getMatchData.status_tv==undefined || getMatchData.status_tv=="") ? 0 :getMatchData.status_tv;
	var config = {
	  method: 'get',
	  url: 'https://bet247exch.com/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sport_type+'&match_id='+match_id,
	  headers: { 
		'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
	  },
	  httpsAgent: new https.Agent({
		rejectUnauthorized: false
	  })
	};
	
	axios(config)
	.then(async function (response) {
	  var newdata=response.data.data.result;
	  
		if(newdata.length>0) {
			
	   var axios = require('axios');
	   var data = JSON.stringify({"marketIds":[newdata[0].market_id]});
	   
	   var config = {
		 method: 'post',
		 url: 'https://bet247exch.com/odds',
		 headers: { 
		   'key': 'D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9', 
		   'Content-Type': 'application/json', 
		   'Cookie': 'XSRF-TOKEN=eyJpdiI6IkpibzE5akRzV0tGUWpcL25XamZ5RjR3PT0iLCJ2YWx1ZSI6ImhzZEhcL1lINHpPSEhPaUxvVXhvU0gybWtET1hUa2Z3Ym5hZVczdHhzQnhObUpHVFB2cFBPNTRhVFVUUVhZYlNHIiwibWFjIjoiOWU1YmVmNjAxYTU4ZDI0ZTRkMDQzZTcwZmYxNDM5MTE0NDUwNDk3YWRjNGRiNzYzNDE5NDE2NThhNDlmMTliOCJ9; laravel_session=eyJpdiI6IkxEdE1paUJPQ1paa3NjYXA4UXBORHc9PSIsInZhbHVlIjoiemFudzBQZmhLTWdKXC9kd2d0OFwvNFwveXUxa1FsNFZaeThrckZZbzg3SUNTODBBUUN5VkJBYTJLcm0rbk9lcU9vbSIsIm1hYyI6ImI2ZjYyNjk3MTgzMzA0MDA5YTE2NmExZDY5MGExMjkzNzM1YTJkZTQzYjQzMjAyYWM1MjNlN2NmMDcyNjIzODYifQ%3D%3D'
		 },httpsAgent: new https.Agent({
			rejectUnauthorized: false
		  }),
		 data : data
	   };
	   
	   axios(config)
	   .then(async function (response2) {
		
		 if(response2.data.data.result!=null){
			if(response2.data.data.result.length==0){
				res.json({ success: false, message: 'No Data found',data:[],data1:[],suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData,isResultDeclare:isResultDeclare});
			}
			else {
				myarr.push(response2.data.data.result);
				
						  //////////////console.log(response.data.data.result);
						   var Oods_data = new Oods();
						   Oods_data.matchdata = JSON.stringify({data:myarr,data1:newdata,});
			  
						  Oods_data.save();
				  
						  const buttonvalue = await Buttonvalue.findOne({ "user_id": req.user.sub });
						  
						  // convert Unmatch Bid into Match Bid
						  convertUnmatchToMatchCron(req,res);
						  //saveMatchToDb(newdata);
						  res.json({ success: true, message: 'odds List',data:myarr,data1:newdata,buttonvalue:buttonvalue ,suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData,isResultDeclare:isResultDeclare});
		  
		  
		  
		  
		  
			} 
		 }else {
			
			// res.json({  success: false, message: 'No Data found',data:[],data1:[],bookmaker:[],suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData });
			socket.emit("FromAPI4", {  success: false, message: 'No Data found',data:[],data1:[],bookmaker:[],suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData,isResultDeclare:isResultDeclare });
		} 
		 
	   })
	   .catch(function (error) {
		// res.json({ success: false, message: 'No Data found',data:[],data1:[] ,bookmaker:[],suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData});
		socket.emit("FromAPI4", {success: false, message: 'No Data found',data:[],data1:[] ,bookmaker:[],suspendcount:isSuspended,show_tv:getMatchData.status_tv,singleMatchData:getMatchData,isResultDeclare:isResultDeclare});
	
	});
	   
		}else{
			// res.json({ success: true, message: 'odds List',data:[],data1:newdata,bookmaker:[],suspendcount:isSuspended ,show_tv:getMatchData.status_tv,singleMatchData:getMatchData });

			socket.emit("FromAPI4",{ success: true, message: 'odds List',data:[],data1:newdata,bookmaker:[],suspendcount:isSuspended ,show_tv:getMatchData.status_tv,singleMatchData:getMatchData ,isResultDeclare:isResultDeclare});
		}
	
	
	
	
		
			
	
	
	
	
	})
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	


	
  
  
  
  








  
  // Emitting a new message. Will be consumed by the client
 
};

server.listen(port, () => console.log(`Listening on port ${port}`));