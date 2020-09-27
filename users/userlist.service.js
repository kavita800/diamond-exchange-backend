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
    current_user_data,
	updateEventUnmatchStatus
};


 function updateEventUnmatchStatus(req,res){
	var eventId = req.body.event_id;
	var event_action = req.body.event_action;
	Manualmatch.updateOne({match_id: eventId}, { $set:{ unmatch_bet: event_action} }, {upsert: true},function(err,resu){
		if(err!=null){
			res.json({ success: false, message: 'unable to update unmatch bet status' })
		}
		else {
			res.json({ success: true, message: 'unmatch bet status updated successfully' })
		}
	});
	
}
async function current_user_data(req,res){
	
	var userId = req.params.id;
	var eventType = req.body.event_type;
	var teamName = req.body.team_name;
	
	var getUserData = await User.findOne({_id:userId});
	if(getUserData!=null && getUserData.length>0){
		res.json({"success":true,"message":"user data","data":getUserData})	
	}
	else {
		res.json({"success":false,"message":"No user found","data":getUserData})
	}
}