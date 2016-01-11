
/*
 * This file only renders differet pages as per user's actions
 */

// Facebook's Login/SignUp Page
exports.index = function(req, res){
  console.log("Inside INDEX function");
  res.render('index');
};


//User's HOME Page
function home(req, res){
	
	console.log("Inside HOME function..");
	
	if (req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("home");
	}
	else{
		res.redirect('/');
	}
	
}

//User's ABOUT Page

function about(req, res){
	
	console.log("Inside ABOUT function..");
	
	if (req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("about");
	}
	else{
		res.redirect('/');
	}
	
}


//User's CONTACT_INFO Page

function contactInfo(req, res){
	
	console.log("Inside CONTACTINFO function..");
	
	if (req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("contactInfo");
	}
	else{
		res.redirect('/');
	}
	
}


//User's WORK_EDUCATION_INFO Page

function workEduInfo(req, res){
	
	console.log("Inside WORK_EDU_INFO function..");
	
	if (req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("workEdu");
	}
	else{
		res.redirect('/');
	}
	
}


//User's LIFE_INFO Page

function life(req, res){
	
	console.log("Inside LIFE_INFO function..");
	
	if (req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("life");
	}
	else{
		res.redirect('/');
	}
	
}


//User's INTERESTS Page

function interests(req, res){
	
	console.log("Insid INTERESTS function..");
	
	if (req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("interests");
	}
	else{
		res.redirect('/');
	}
	
}



//User's FRIENDS Page

function friends(req, res){
	
	console.log("Insid FRIENDS function..");
	
	if (req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("friends");
	}
	else{
		res.redirect('/');
	}
	
}


//User's GROUP Page

function groups(req, res){
	
	console.log("Insid GROUPS function..");
	
	if (req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("group");
	}
	else{
		res.redirect('/');
	}
	
}


//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	console.log("Inside LOGOUT function...");
	req.session.destroy();
	res.end();
};


exports.home=home;
exports.about=about;
exports.contactInfo=contactInfo;
exports.workEduInfo=workEduInfo;
exports.life=life;
exports.interests=interests;
exports.friends=friends;
exports.groups=groups;