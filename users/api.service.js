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

const defaultApiKey = "dnFfmALuPsQ802gLTfckyRbvYgdofovieekzAVheamLPG6EyB5AH9qEMC22F13jbrD6";
module.exports = {
   cricketMatchList,
   sportOddsList

};


function cricketMatchList(req,res){
	
	var getKey = req.query.apikey;
	
	if(getKey!=defaultApiKey){
		res.json({ success: false, message: 'Invalid Api Key'});
	} 
	else {
		var sportId = "cricket";
		var axios = require('axios');
		var myArr =[];
		var myArr1 =[];
		var config = {
		  method: 'get',
		  url: 'http://rohitash.dream24.bet:3000/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sportId,
		  headers: { 
			'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
		  },
		  httpsAgent: new https.Agent({
			rejectUnauthorized: false
		  })
		};

		axios(config)
		.then(async function (response) {
			
			if(response.data.code!='400'){

			
		  var newdata=response.data.data.result;
		 
		  
		   for(var i=0;i<newdata.length;i++){
			
			var config = {
				method: 'get',
				url: 'http://rohitash.dream24.bet:3000/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport='+sportId+'&series_id='+newdata[i].series_id,
				headers: { 
				  'Cookie': 'XSRF-TOKEN=eyJpdiI6InJ1bzJYdUxEZ3h2eDEyZHdZY0VzQUE9PSIsInZhbHVlIjoiOVl0ZFhHTVRLOEd6cHlOOXV3TlhtQkF0Y3lFejVwZTJPcUd2ZnZDKzkxXC95VVV4NHBacmIxWW5BU3ZkOVRSdnQiLCJtYWMiOiI5Y2NmYjVkMWI5Y2JmY2VjODg2MDA4NDYzNTJkNmVkMTFmM2ExNDY3YzY4Y2IzMmEyZGMzYzE4NDE4M2M0YTQyIn0%3D; laravel_session=eyJpdiI6IkE3cHM4SUNzYWtscGs4d0JSSzZFTkE9PSIsInZhbHVlIjoiNjBnd1Z2ZVpJZEpRbTJMY2IyK2FyRW5PTU52bytqVGtXc0hYZUxNUEhBK2NISmJDenYzSlAxNVVMQTBpM09wRiIsIm1hYyI6ImIzMzdlZDYzYzA2MGQwOTM0Y2VlNDE1ZDcwZTM0YmI0ZTExOTY2ZmVlNzIwMmNlYTZlYmMyYTFjZmJmZjU0ODcifQ%3D%3D'
				},
				httpsAgent: new https.Agent({
				  rejectUnauthorized: false
				})
			  };
			  
			  var matchDataArr = await axios(config)
			  .then(function (response1) {
				return response1.data.data.result;

				//////////////console.log(newdata2);
				
			  })
			 if(matchDataArr!==undefined && matchDataArr.length>0) {
				  for(j=0;j<=matchDataArr.length;j++){	
					myArr.push(matchDataArr[j]);
				  }
			 }
			  
			  
			   

		  }
		 
			res.json({ success: true, message: 'Success', data: myArr });

		  
		}
		});
	}
}


async function sportOddsList(req,res){
	
	var getKey = req.query.apikey;
	
	if(getKey!=defaultApiKey){
		res.json({ success: false, message: 'Invalid Api Key'});
	} 
	else {
				
		var matchId = req.query.match_id;
		var myarr=[];
		var axios = require('axios');
	
	
		var config = {
		  method: 'get',
		  url: 'http://rohitash.dream24.bet:3000/game-list?key=D73TQ7O0X6gZxXLBidih2pCUDzuakv67UEQs17AcqzJran8Gc9&sport=cricket&match_id='+matchId,
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
			 url: 'http://rohitash.dream24.bet:3000/odds',
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
			
			 if(response2.data.data.result!=undefined || response2.data.data.result!=null){
				if(response2.data.data.result.length==0){
					res.json({ success: false, message: 'No Data found',data:[]});
				}
				else {
					myarr.push(response2.data.data.result);
				
					  res.json({ success: true, message: 'odds List',data:myarr });
			  } 
			 }else {
				
				res.json({  success: false, message: 'No Data found',data:[] });
			} 
			 
		   })
		   .catch(function (error) {
			res.json({ success: false, message: 'No Data found',data:[]});
		   });
		   
			}else{
				res.json({ success: true, message: 'odds List',data:[] });
			}

		})
	}

}

