// This file handles User's Login, signup activities. Also, it handles ABOUT & INTEREST information

var mq_client = require('../rpc/client');

// Function to check if the user can be loggedin to the system or not. 

function login(req, res)
{
	
	console.log("In LOGIN function");
	
	var username = req.param("loginEmail");
	var password = req.param("loginPass");
	var msg_payload = { "username": username, "password": password};
		
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("Successful Login");
				req.session.username = results.data._id;
				res.end("SUCCESS");
			}
			else if (results.code == 400){    
				
				console.log("Unsuccessful Login");
				res.end("FAILED");
			}
			else if (results.code == 0){    
				
				console.log("DB Operation Failed");
				res.end();
			}
		}  
	});
}


//Function to Signup a new User into the system. 

function signup(req, res)
{
	
	console.log("In SIGNUP function");
	
	var email = req.param("emailId");
	var fname = req.param("fName");
	var lname = req.param("lName");
	var password = req.param("password");
	var msg_payload = { "email": email, "fname": fname, "lname": lname, "password": password};
		
	mq_client.make_request('signup_queue',msg_payload, function(err,results){
		
		console.log(results);
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("Successful SignUp");
				res.end("SUCCESS");
			}
			else if (results.code == 0){    
				
				console.log("Unsuccessful SignUP");
				res.end("FAILED");
			}
		}  
	});
}

//Function to Signup a new User into the system. 

function user_about_update(req, res)
{
	
	console.log("In USER_ABOUT function");
	
	var about_type = req.param("about_type");
	var username = req.session.username;
	var msg_payload = {};
	
	if (req.param("about_type") == "C"){
		var phone = req.param("phone");
		var address = req.param("address");
		msg_payload = { "phone": phone, "address": address, "about_type": about_type, "username": username};
	}
	
	else if (req.param("about_type") == "W"){
		var uniName = req.param("uniName");
		var uniLoc = req.param("uniLoc");
		var compName = req.param("compName");
		var compLoc = req.param("compLoc");
		var desig = req.param("desig");
		msg_payload = { "univ_name": uniName, "univ_location": uniLoc, "company_name": compName, "company_location": compLoc, 
						"Designation": desig, "about_type": about_type, "username": username};
	}
	
	else if (req.param("about_type") == "I"){
		var music = req.param("music");
		var shows = req.param("shows");
		var sports = req.param("sports");
		msg_payload = { "music": music, "shows": shows, "sports": sports, "about_type": about_type, "username": username};
	}
	
	mq_client.make_request('about_update_queue',msg_payload, function(err,results){
		
		console.log(results);
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("Successful ABOUT operation");
				res.end("SUCCESS");
			}
			else if (results.code == 0){    
				
				console.log("Unsuccessful ABOUT operation");
				res.end("FAILED");
			}
		}  
	});
}


//Function to get User's OVERVIEW.
function user_about_get(req, res)
{
	
	console.log("In ABOUT_GET function");
	
	var username = req.session.username;
	var infoType = req.param("infoType");
	console.log("Client's GET TYPE: "+ infoType);
	var msg_payload = {"username": username, "infoType": infoType};
	
	mq_client.make_request('about_get_queue',msg_payload, function(err,results){
		
		console.log(results);
		
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("Successful ABOUT_GET operation");
				res.end(JSON.stringify(results.data));
			}
			else if (results.code == 0){    
				
				console.log("Unsuccessful ABOUT_GET operation");
				res.end("FAILED");
			}
		}  
	});
}


exports.login=login;
exports.signup=signup;
exports.user_about_update=user_about_update;
exports.user_about_get=user_about_get;