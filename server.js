var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));


var connectionString = 'mongodb://127.0.0.1:27017/test';

if(process.env.MLAB_USER_WEATHER) {
    var username =     process.env.MLAB_USER_WEATHER;
    var password =     process.env.MLAB_PASSWORD_WEATHER ;
    connectionString = 'mongodb://' + username + ':' + password;
    connectionString += '@ds133876.mlab.com:33876/heroku_6tt8hrgt';
}
var mongoose = require('mongoose');
mongoose.connect(connectionString);

require("./proj/app.js")(app);

//var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.PORT || 3000;


app.listen(port);