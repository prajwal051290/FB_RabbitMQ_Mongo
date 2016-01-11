// This file handles all Friend related operations 

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook_db";

function save_feed(msg, callback){
	
	var res = {};
	var username = msg.username;
	var newsfeed = msg.newsfeed;
	
	console.log("Inside SAVE_FEED function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_info');
				
		coll.update({"_id": username}, { $push: {"feeds": newsfeed}}, function(err, user){ 
			
			if (err){
				console.log("Error saving news feed");
				res.code = "0";
			}
			else if (user) {
				
				console.log("News Feed saved Successfully");
				res.code = "200";
				callback(null, res);
			}
			
		});
		
	});

}


function get_feeds(msg, callback){
	
	var res = {}, i, j;
	var username = msg.username;
	var dest_email = [];
	var feed_data = [];
	var feed_details = {};
	var name = "";
	
	console.log("Inside GET_FEEDS function");
	
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
				
				coll.find({"_id": {$in: dest_email}}, {"feeds": true, "first_name": true, "last_name": true, "_id": false}).toArray(function(err, user1){
				
					if (err){
						console.log("Error fetching feeds of my friends");
						res.code = "0";
					}
					else {	
						
						console.log("successful in fetching feeds of my friends");
						res.code = "200";
						
						for (i=0; i < user1.length; i++){
							
							name = user1[i].first_name + " " + user1[i].last_name;
							//console.log(feed_details.name);
							
							for (j=0; j< user1[i].feeds.length; j++){
								
								feed_data.push({"name": name, "feed": user1[i].feeds[j]});
								
							}
						
						}
						console.log("outside : " + feed_data);
						res.data = feed_data; 
						callback(null, res);
					}
				});
			}
			
		});
		
	});


}




function handle_request(msg, callback){
	
	console.log("In handle request of FEED_OPS");
	
	if (msg.type == "S"){ // S --> Save FEED
		save_feed(msg, callback);
	}
	
	if (msg.type == "G"){ // G --> Get feeds of friends.
		get_feeds(msg, callback);
	}
	
	
}

exports.handle_request = handle_request;