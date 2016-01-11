// This file handles all GROUP related operations.

var mq_client = require('../rpc/client');

function group_operations(req, res)
{
	
	console.log("In GROUP_OPERATION function");
	
	var type = req.param("type");
	var username = req.session.username;
	var msg_payload = {};
	
	if (req.param("type") === "C"){ // C --> Create a NEW Group
		var groupName = req.param("groupName");
		var groupDesc = req.param("groupDesc");
		msg_payload = { "username": username, "groupName": groupName, "groupDesc": groupDesc, "type": type};
	}
	
	else if (req.param("type") === "S"){ // S - Show user's groups. 
		msg_payload = { "username": username, "type": type};
	}
	
	else if (req.param("type") === "D"){ // D - Delete a group 
		var grpName = req.param("grpName");
		msg_payload = { "grpName": grpName, "type": type};
	}
	
	else if (req.param("type") === "L"){ // L - List members of a group 
		var grpName = req.param("grpName");
		msg_payload = { "grpName": grpName, "type": type};
	}
	
	else if (req.param("type") === "DM"){ // DM - Delete Member from a group 
		var memName = req.param("memName");
		var grpName1 = req.param("grpName");
		msg_payload = { "grpName": grpName1, "memName": memName, "type": type};
	}
	
	
	else if (req.param("type") === "AL"){ // AL - AddList of members to be added in a group  
		var grpName2 = req.param("grpName");
		msg_payload = { "grpName": grpName2, "type": type};
	}
	
	
	else if (req.param("type") === "AD"){ // AD - Add member in a group actually  
		var grpName3 = req.param("grpName");
		var name = req.param("name");
		msg_payload = { "grpName": grpName3, "name": name, "type": type};
	}
	
	mq_client.make_request('group_queue',msg_payload, function(err,results){
		
		console.log(results);
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("GROUP operation performed successfully");
				res.end(JSON.stringify(results));
			}
			else if (results.code == 0){    
				
				console.log("Failed in performing GROUP operation");
				res.end();
			}
		}  
	});
}


exports.group_operations=group_operations;