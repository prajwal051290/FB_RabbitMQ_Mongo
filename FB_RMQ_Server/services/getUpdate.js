// This file handles all the GET operations of User's About Page

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook_db";

// This function fetches OVERVIEW information of a user
function get_overview(msg, callback){

	mongo.connect(mongoURL, function(){
		
	console.log('Connected to mongo at: ' + mongoURL);
	var coll = mongo.collection('user_info');
	var username = msg.username; 
	var res = {};
	
	coll.findOne({"_id": username}, function(err, user){
			
		if (err){
			console.log("Error getting Overview Info");
			res.code = "0";
		}
		else if (user) {
			console.log("Overview Info retrieved Successfully");
			res.code = "200";
			res.data = user;
		} 			
		callback(null, res);
	});
		
});

}


//This function fetches Life Events of a user
function get_life(msg, callback){

	mongo.connect(mongoURL, function(){
		
	console.log('Connected to mongo at: ' + mongoURL);
	var coll = mongo.collection('user_info');
	var username = msg.username; 
	var res = {};
	
	coll.findOne({"_id": username}, function(err, user){
			
		if (err){
			console.log("Error getting Life Events");
			res.code = "0";
		}
		else if (user) {
			console.log("Life Events retrieved Successfully");
			res.code = "200";
			res.data = user;
		} 			
		callback(null, res);
	});
		
});

}


function handle_request(msg, callback){
	
	console.log("In handle request of ABOUT_GET");
	
	console.log("Get Type: " + msg.infoType);
	if (msg.infoType == "O"){ // O --> Overview
		get_overview(msg, callback);
	}
	else if (msg.infoType == "L"){ // L --> Life Events
		get_life(msg, callback);
	}
	
}

exports.handle_request = handle_request;