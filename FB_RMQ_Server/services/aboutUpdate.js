// This file handles all the UPDAET operations of User's About Page

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook_db";


// This function saves user's Contact Info.
function update_contact_info(msg, callback){
	
	var res = {};
	var phone = msg.phone;
	var address = msg.address;
	var username = msg.username;
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_info');
		var JSON_Doc = {"address_info": {"phone": phone, "address": address}};
		
		coll.update({"_id": username}, 
					{ $set: JSON_Doc}, 
					function(err, user){
			
			if (err){
				console.log("Error updating Contact Info");
				res.code = "0";
			}
			else if (user) {
				
				console.log("Contact Info updated Successfully");
				res.code = "200";
							
			} 			
			callback(null, res);
		});
		
	});

}


//This function saves user's Work and Education Info.
function update_work_edu_info(msg, callback){
	
	var res = {};
	var univ_name = msg.univ_name;
	var univ_location = msg.univ_location;
	var company_name = msg.company_name;
	var company_location = msg.company_location;
	var Designation = msg.Designation;
	var username = msg.username;
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_info');
		var JSON_Doc = {"work_edu_info": {"univ_name": univ_name, "univ_location": univ_location, "company_name": company_name, 
						"company_location": company_location, "Designation": Designation}};
		
		coll.update({"_id": username}, 
					{ $set: JSON_Doc}, 
					function(err, user){
			
			if (err){
				console.log("Error updating Work & Edu Info");
				res.code = "0";
			}
			else if (user) {
				
				console.log("Work & Education Info updated Successfully");
				res.code = "200";
							
			} 			
			callback(null, res);
		});
		
	});

}



//This function saves user's Interest Info.
function update_interest_info(msg, callback){
	
	var res = {};
	var music = msg.music;
	var shows = msg.shows;
	var sports = msg.sports;
	var username = msg.username;
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_info');
		var JSON_Doc = {"interest_info": {"music": music, "shows": shows, "sports": sports}};
		
		coll.update({"_id": username}, 
					{ $set: JSON_Doc}, 
					function(err, user){
			
			if (err){
				console.log("Error updating Interest Info");
				res.code = "0";
			}
			else if (user) {
				
				console.log("Interest Info updated Successfully");
				res.code = "200";
							
			} 			
			callback(null, res);
		});
		
	});

}

// This function handles various operations of User's ABOUT Page based on type
function handle_request(msg, callback){
	
	console.log("In handle request of ABOUT_UPDATE");
	
	var result = {};
	
	if (msg.about_type == "C"){
		update_contact_info(msg, callback);
	}
	
	else if (msg.about_type == "W"){
		update_work_edu_info(msg, callback);
	}
	
	else if (msg.about_type == "I"){
		update_interest_info(msg, callback);
	}
}

exports.handle_request = handle_request;