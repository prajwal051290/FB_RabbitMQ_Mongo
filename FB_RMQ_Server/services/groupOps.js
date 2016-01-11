// This file handles all Friend related operations 

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook_db";


// This function creates a new group

function create_group(msg, callback){
	
	var res = {};
	var username = msg.username;
	var groupName = msg.groupName;
	var groupDesc = msg.groupDesc;
	
	console.log("Inside CREATE_GROUP function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('groups');
				
		coll.insert({"_id": groupName, "group_desc": groupDesc, "admin": username}, function(err, user){ 
			
			if (err){
				console.log("Error creating a group");
				res.code = "0";
			}
			else if (user) {
				
				console.log("Group created Successfully");
				res.code = "200";
				callback(null, res);
			}
			
		});
		
	});

}


//This function shows all the groups a user is part of

function show_groups(msg, callback){
	
	var res = {};
	var username = msg.username;
	var groupList = [], i;
	
	console.log("Inside SHOW_GROUPS function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('groups');
				
		coll.find({ $or: [{"admin": username}, {"members":{$elemMatch:{$eq: "username"}}}]}, {"_id": true}).toArray(function(err, user){ 
			
			if (err){
				console.log("Error fetching user's groups");
				res.code = "0";
			}
			else if (user) {
				
				console.log("User's groups fetched Successfully");
				
				for (i=0; i < user.length; i++){
					
					groupList.push(user[i]._id);
					
				}
				
				res.code = "200";
				res.data = groupList; 
				callback(null, res);
			}
			
		});
		
	});

}



//This function deletes a group from a system

function delete_group(msg, callback){
	
	var res = {};
	var grpName = msg.grpName;
	
	console.log("Inside DELETE_GROUP function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('groups');
				
		coll.remove({"_id": grpName}, function(err, user){ 
			
			if (err){
				console.log("Error deleting a GROUP");
				res.code = "0";
			}
			else if (user) {
				
				console.log("GROUP deleted Successfully");
				res.code = "200";
				callback(null, res);
			}
			
		});
		
	});

}


//This function shows all the members of a group

function show_members(msg, callback){
	
	var res = {}, i;
	var grpName = msg.grpName;
	var listEmail = [];
	var listNames = [];
	
	console.log("Inside SHOW_MEMBERS function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('groups');
				
		coll.findOne({"_id": grpName}, {"admin": true, "members": true}, function(err, user){ 
			
			if (err){
				console.log("Error fetching members of a GROUP");
				res.code = "0";
			}
			else if (user) {
				
				console.log("GROUP members fetched Successfully");
				res.code = "200";
				
				listEmail.push(user.admin);
				
				for (i=0; i < user.members.length; i++){
					
					listEmail.push(user.members[i]);
					
				}
							
				var coll = mongo.collection('user_info');
				
				coll.find({"_id": { $in: listEmail}}, {"first_name": true}).toArray(function(err, user1){
					
				if (err){
					console.log("Error fetching names by EmailIDs");
					res.code = "0";
				}
				else if (user1) {
					
					console.log("Successful in fetching names by EmailIDs");
					res.code = "200";
					
					for (i=0; i < user1.length; i++){
						
						listNames.push(user1[i].first_name);
						
					}
					
					res.data = listNames; 	
					callback(null, res);
				}		
					
				
			});
			
			}		
		});
		
	});

}



//This function deletes members from a group

function delete_members(msg, callback){
	
	var res = {};
	var memName = msg.memName;
	var grpName = msg.grpName;
	
	console.log("Inside DELETE_MEMBER function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_info');
				
		coll.findOne({"first_name": memName}, {"_id": true}, function(err, user){ 
			
			if (err){
				console.log("Error fetching EmailID by name");
				res.code = "0";
			}
			else if (user) {
				
				console.log("Successfully fetched EmailID by name");
				res.code = "200";
				
				coll = mongo.collection('groups');
		
				coll.update({"_id": grpName}, { $pull: {members: user._id}}, function(err, user1){ 
					
					if (err){
						console.log("Error deleting member from a group");
						res.code = "0";
					}
					else if (user1) {
						
						console.log("Member deleted successfully");
						res.code = "200";
						callback(null, res);
					}		
				});		
					
				}	
			});
					
		});
}



//This function lists members to be added in the group

function add_member_group(msg, callback){
	
	var res = {}, i;
	var grpName = msg.grpName;
	var grpMembers = [];
	var grpMemberNames = [];
	
	console.log("Inside ADD_MEMBER_GROUP function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('groups');
				
		coll.findOne({"_id": grpName}, {"members": true}, function(err, user){ 
			
			if (err){
				console.log("Error fetching members of a group");
				res.code = "0";
			}
			else if (user) {
				
				console.log("Successfully fetched members of a group");
				res.code = "200";
				
				for (i=0; i < user.members.length; i++){
					
					grpMembers.push(user.members[i]);
					
				}
				
				console.log("Member's Groups : " + grpMembers);
				
				coll = mongo.collection('user_info');
		
				coll.find({"_id": {$nin: grpMembers}}, {"first_name": true}).toArray(function(err, user1){ 
					
					if (err){
						console.log("Error fetching first name of non-members");
						res.code = "0";
					}
					else if (user1) {
						
						console.log("First name of non-members fetched successfully");
						res.code = "200";
						
						console.log("User1 length : " + user1.length);
						
						for (i=0; i < user1.length; i++){
							
							grpMemberNames.push(user1[i].first_name);
							
						}
						
						res.data = grpMemberNames;
						callback(null, res);
					}		
				});		
					
				}	
			});
					
		});
}



//This function lists members to be added in the group

function add_member_group_actual(msg, callback){
	
	var res = {};
	var grpName = msg.grpName;
	var name = msg.name;
		
	console.log("Inside ADD_MEMBER_GROUP_ACTUAL function");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_info');
				
		coll.findOne({"first_name": name}, {"_id": true}, function(err, user){ 
			
			if (err){
				console.log("Error fetching EmailID by name");
				res.code = "0";
			}
			else if (user) {
				
				console.log("Successfully fetched emailID by names");
				res.code = "200";
				
				coll = mongo.collection('groups');
		
				coll.update({"_id": grpName}, {$push: {"members": user._id}}, function(err, user1){ 
					
					if (err){
						console.log("Error adding member to a group");
						res.code = "0";
					}
					else if (user1) {
						
						console.log("Successfully added member to a group");
						res.code = "200";
						callback(null, res);
					}		
				});		
					
				}	
			});
					
		});
}





function handle_request(msg, callback){
	
	console.log("In handle request of GROUP_OPS");
	
	if (msg.type == "C"){ // C --> Create a new Group
		create_group(msg, callback);
	}
	
	if (msg.type == "S"){ // S --> Show user's groups.
		show_groups(msg, callback);
	}
	
	if (msg.type == "D"){ // D --> Delete a Group.
		delete_group(msg, callback);
	}
	
	if (msg.type == "L"){ // L --> Show members of a group
		show_members(msg, callback);
	}
	
	if (msg.type == "DM"){ // DM --> Delete Member from a group
		delete_members(msg, callback);
	}
	
	if (msg.type == "AL"){ // AL - AddList of members to be added in a group
		add_member_group(msg, callback);
	}
	
	if (msg.type == "AD"){ // AD - Add member in a group actually
		add_member_group_actual(msg, callback);
	}
	
}

exports.handle_request = handle_request;