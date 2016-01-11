// This file handles all friend related operations like 'Find', 'Send Request', 'Accept Request'

var mq_client = require('../rpc/client');

function friend_operations(req, res)
{
	
	console.log("In FRIEND_OPERATION function");
	
	var type = req.param("type");
	var username = req.session.username;
	var msg_payload = {};
	
	if (req.param("type") === "S"){ // S --> Search Friend
		var searchName = req.param("name");
		msg_payload = { "username": username, "searchName": searchName, "type": type};
	}
	
	else if (req.param("type") === "P"){ // P - Sending friend request which will show status 'P' i.e. Pending. 
		var destination = req.param("destination");
		msg_payload = { "username": username, "destination": destination, "type": type};
	}
	
	else if (req.param("type") === "SP"){ // SP - Show pending friend requests 
		msg_payload = { "username": username, "type": type};
	}
	
	else if (req.param("type") === "AR"){ // AR - Accept friend request
		var acceptFriend = req.param("acceptFriend");
		msg_payload = { "username": username, "acceptFriend": acceptFriend, "type": type};
	}
	
	else if (req.param("type") === "SF"){ // SF - Show my friends
		msg_payload = { "username": username, "type": type};
	}
	
	mq_client.make_request('friend_queue',msg_payload, function(err,results){
		
		console.log(results);
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("FRIENDS Operation performed successfully");
				res.end(JSON.stringify(results));
			}
			else if (results.code == 0){    
				
				console.log("Failed in performing FRIENDS operation");
				res.end();
			}
		}  
	});
}


exports.friend_operations=friend_operations;