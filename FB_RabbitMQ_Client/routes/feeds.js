// This file handles all FEEDS related operations.

var mq_client = require('../rpc/client');

function feed_operations(req, res)
{
	
	console.log("In FEED_OPERATION function");
	
	var type = req.param("type");
	var username = req.session.username;
	var msg_payload = {};
	
	if (req.param("type") === "S"){ // S --> Save FEED
		var newsfeed = req.param("newsfeed");
		msg_payload = { "username": username, "newsfeed": newsfeed, "type": type};
	}
	
	else if (req.param("type") === "G"){ // G - Get feeds from friends. 
		msg_payload = { "username": username, "type": type};
	}
	
	mq_client.make_request('feed_queue',msg_payload, function(err,results){
		
		console.log(results);
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("FEED operation performed successfully");
				res.end(JSON.stringify(results));
			}
			else if (results.code == 0){    
				
				console.log("Failed in performing FEED operation");
				res.end();
			}
		}  
	});
}


exports.feed_operations=feed_operations;