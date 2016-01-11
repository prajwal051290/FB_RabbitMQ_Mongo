var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook_db";

var crypto = require('crypto');

function handle_request(msg, callback){
	
	console.log("In handle request of SIGNUP");
	
	var res = {};
	var username = msg.email;
	var fname = msg.fname;
	var lname = msg.lname;
	var password = msg.password;
	
	var encrypPassword = crypto.createHash('sha1').update(password).digest("hex"); // Encrption of Password
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_info');
		var JSON_Doc = {"_id": username, "password": encrypPassword, "first_name": fname, "last_name": lname};
		
		coll.insert(JSON_Doc, function(err, user){
			
			if (err){
				console.log("Error Inserting SignUP Info");
				res.code = "0";
			}
			else if (user) {
				
				console.log("New User Created Successfully");
				res.code = "200";
							
			} 			
			callback(null, res);
			
		});
		
	});

}

exports.handle_request = handle_request;