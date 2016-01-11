var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook_db";

var crypto = require('crypto');

function handle_request(msg, callback){
	
	console.log("In handle request of LOGIN");
	
	var res = {};
	var username = msg.username;
	var password = msg.password;
	
	var encrypPassword = crypto.createHash('sha1').update(password).digest("hex"); // Encrption of Password
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_info');
		var JSON_Doc = {"_id": username, "password": encrypPassword};
		
		coll.findOne(JSON_Doc, function(err, user){
			
			if (err){
				console.log("Error fetching Login Info");
				res.code = "0";
			}
			else if (user) {
				
				console.log("Login Info found");
				res.code = "200";
				res.data = user;
							
			} else {
				console.log("No such Login Credentials exist");
				res.code = "400";
			}
			
			callback(null, res);
			
		});
		
	});

}

exports.handle_request = handle_request;