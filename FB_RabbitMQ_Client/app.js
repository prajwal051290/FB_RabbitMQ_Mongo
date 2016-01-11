var express = require('express')
  , index = require('./routes/index')
  , user = require('./routes/user')
  , friends = require('./routes/friends')
  , feeds = require('./routes/feeds')
  , groups = require('./routes/groups')
  , http = require('http')
  , path = require('path');


//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/facebook_db";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");
//var login = require("./routes/login");


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/****** Login, Logout, SignUp ***********/
app.get('/', index.index);
app.post('/login', user.login);
app.post('/logout', index.logout);
app.post('/signUp', user.signup);

/****** Render Pages ***********/
app.get('/home', index.home);
app.get('/about', index.about);
app.get('/contactInfo', index.contactInfo);
app.get('/workedu', index.workEduInfo);
app.get('/life', index.life);
app.get('/interests', index.interests);
app.get('/friends', index.friends);
app.get('/group', index.groups);

/****** ABOUT Operations ***********/
app.post('/aboutUpdate', user.user_about_update); // This one action "aboutUpdate" works for updating ABOUT Info based on 'type of update' 
app.post('/aboutGet', user.user_about_get); // This one action "aboutGet" works for getting ABOUT Info based on 'type of get'


/****** FRIENDS Operations ***********/
app.post('/friendOps', friends.friend_operations);

/****** FEEDS Operations ***********/
app.post('/feedOps', feeds.feed_operations);


/****** GROUP Operations ***********/
app.post('/groupOps', groups.group_operations);

//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Facebook server listening on port ' + app.get('port'));
	});  
});