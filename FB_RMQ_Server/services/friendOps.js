// This file handles all Friend related operations 

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook_db";


function search_friend(msg, callback){
	
	var res = {};
	var searchName = msg.searchName;
	var username = msg.username;
	
	console.log("Inside SEARCH_FRIEND function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_info');
				
		coll.findOne({"first_name": searchName}, {"_id":1, "first_name": 1, "last_name": 1}, function(err, user){ // Get EmailID by Name
			
			if (err){
				console.log("Error fetching EmailID by Name");
				res.code = "0";
			}
			else if (user) {
				
				console.log("EmailID for a name fetched Successfully");
				
				// Now check in FRIENDS collection based on EmailIDs (Two queries inside one another)
				
				var coll = mongo.collection('friends');
				var JSON_Obj = {"source_id": username, "destination_id": user._id};
				
				coll.findOne(JSON_Obj, function(err, user1){ // Get EmailID by Name
					
					if (err){
						console.log("Error fetching FRIENDS collections");
						res.code = "0";
					}
					else {						
						console.log("FRIENDS collection fetched Successfully");
						res.code = "200";
						res.data = user;
						res.data1 = user1;
					}
					callback(null, res);
				});
			}
			
		});
		
	});

}


function send_friend_request(msg, callback){

	var res = {};
	var destination = msg.destination;
	var username = msg.username;
	var JSON_Obj = {};
	
	console.log("Inside SEND_FRIEND_REQUEST function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('friends');
		JSON_Obj = {"source_id": username, "destination_id": destination, "status": "P"};
		
		coll.insert(JSON_Obj, function(err, user){
			
			if (err){
				console.log("Error in inserting FRIENDS Collection - 1");
				res.code = "0";
			}
			else if (user) {
				
				console.log("FRIENDS Collection - 1 inserted Successfully");
				
				coll = mongo.collection('friends');
				JSON_Obj = {"source_id": destination, "destination_id": username, "status": "P"};
				
				coll.insert(JSON_Obj, function(err, user1){ 
					
					if (err){
						console.log("Error in inserting FRIENDS Collection - 2");
						res.code = "0";
					}
					else {						
						console.log("FRIENDS Collection - 2 inserted Successfully");
						res.code = "200";
						res.data = user;
						res.data1 = user1;
					}
					callback(null, res);
				});
			}
			
		});
		
	});

}


// This functions brings all the pending requests for the logged in user.

function get_pending_requests(msg, callback){

	var res = {};
	var username = msg.username;
	var JSON_Obj = {};
	var source_friends = [], source_names = [], i; 
	
	console.log("Inside GET_PENDING_REQUEST function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('friends');
				
		coll.find({"destination_id": username, "status": "P"}, {"source_id": true, "_id": false}).toArray(function(err, user){ 
			
			if (err){
				console.log("Error in fetching pending friend requests");
				res.code = "0";
			}
			else if (user) {
				
				console.log("Pending friends requests fectched Successfully");
				
				for (i=0; i < user.length; i++){
					source_friends.push(user[i].source_id);
				}
				
				coll = mongo.collection('user_info');
							
				coll.find({"_id": {$in: source_friends}}, {"first_name": true, "_id": false}).toArray(function(err, user1){ 
					
					if (err){
						console.log("Error fectching Names of friends who had sent requests");
						res.code = "0";
					}
					else {	
						
						for (i=0; i < user1.length; i++){
							source_names.push(user1[i].first_name);
						}
											
						console.log("Names of friends who had sent requests fetched Successfully");
						res.code = "200";
						res.data = source_names;
						
					}
					callback(null, res);
				});
			}
			
		});
		
	});

}



//This functions accepts the pending request.

function accept_pending_requests(msg, callback){

	var res = {};
	var username = msg.username;
	var acceptFriend = msg.acceptFriend;
	var JSON_Obj = {};
		
	console.log("Inside ACCEPT_PENDING_REQUEST function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_info');
				
		coll.findOne({"first_name": acceptFriend}, {"_id": true}, function(err, user){ 
			
			if (err){
				console.log("Error in fetching Emaild of a person whose pending request is to be accepted.");
				res.code = "0";
			}
			else if (user) {
				
				console.log("Successful in fetching Emaild of a person whose pending request is to be accepted.");
				
				coll = mongo.collection('friends');
							
				coll.update({"source_id": username, "destination_id": user._id}, {$set: {"status": "A"}}, function(err, user1){ 
					
					if (err){
						console.log("Error updating FRIENDS collection - 1");
						res.code = "0";
					}
					else {	
						
						console.log("successful updation of FRIENDS collection - 1");
						res.code = "200";
						
						coll = mongo.collection('friends');
						
						coll.update({"source_id": user._id, "destination_id": username}, {$set: {"status": "A"}}, function(err, user1){ 
							
							if (err){
								console.log("Error updating FRIENDS collection - 2");
								res.code = "0";
							}
							else {	
								
								console.log("successful updation of FRIENDS collection - 2");
								res.code = "200";
							}	
							
						callback(null, res);
					});
						
					}
				});
			}
			
		});
		
	});

}




//This functions shows my friends.

function show_my_friends(msg, callback){

	var res = {}, i;
	var username = msg.username;
	var dest_email = [], dest_names = [];
	
	console.log("Inside SHOW_MY_FRIENDS function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('friends');
				
		coll.find({"source_id": username, "status": "A"}, {"destination_id": true}).toArray(function(err, user){ 
			
			if (err){
				console.log("Error in fetching Emailds of my friends");
				res.code = "0";
			}
			else if (user) {
				
				console.log("Successful in fetching Emailds of my friends");
				
				for (i=0; i < user.length; i++){
					dest_email.push(user[i].destination_id);
				}
				
				coll = mongo.collection('user_info');
				
				coll.find({"_id": {$in: dest_email}}, {"first_name": true, "last_name": true, "_id": false}).toArray(function(err, user1){
				
					if (err){
						console.log("Error fetching Name details of my friends");
						res.code = "0";
					}
					else {	
						
						console.log("successful in fetching Name details of my friends");
						res.code = "200";
						
						for (i=0; i < user1.length; i++){
							dest_names.push(user1[i].first_name + " " + user1[i].last_name);
						}
						res.data = dest_names; 
						callback(null, res);
					}
				});
			}
			
		});
		
	});

}




function handle_request(msg, callback){
	
	console.log("In handle request of FRIEND_OPS");
	
	if (msg.type == "S"){ // S --> Search Friend
		search_friend(msg, callback);
	}
	
	if (msg.type == "P"){ // P - Sending friend request which will show status 'P' i.e. Pending.
		send_friend_request(msg, callback);
	}
	
	if (msg.type == "SP"){ // SP - Show pending friends requests
		get_pending_requests(msg, callback);
	}
	
	if (msg.type == "AR"){ // AR - Accept friend request
		accept_pending_requests(msg, callback);
	}
	
	if (msg.type == "SF"){ // SF - Show My Friends
		show_my_friends(msg, callback);
	}
}

exports.handle_request = handle_request;