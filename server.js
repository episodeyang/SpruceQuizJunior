/**
 * The API server for 学霸帮帮忙
 * author: Ge Yang
 * @type {*|boolean}
 */

//require('nodetime').profile({
//    accountKey: 'cb0835da7eb6304c00877ca11569df1ef72ebb10',
//    appName: 'SpruceQuizJunior'
//});

var resetDB = ( process.env.RESETDB || false );

var express = require('express')
    , http = require('http')
    , mongoose = require('mongoose')
    , passport = require('passport');
var path = require('path')
    , User = require('./server/models/User.js');
var lessMiddleware = require('less-middleware');

var app = module.exports = express();

mongoose.connect('mongodb://localhost/sprucedb', function (err) {
    if (resetDB == 'true' || resetDB == 'True') {
        console.log(resetDB);
        mongoose.connection.db.dropDatabase(function (err) {
//            require('./server/models/Initialization.js');
            console.log("reset database complete");
        });
    }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected to Spruce database');
});

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'))
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(lessMiddleware({ src: __dirname + '/client', compress: true }));
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.cookieSession(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
    }));
app.use(passport.initialize());
app.use(passport.session());


passport.use(User.localStrategy);
//passport.use(User.twitterStrategy());  // Comment out this line if you don't want to enable login via Twitter
//passport.use(User.facebookStrategy()); // Comment out this line if you don't want to enable login via Facebook
//passport.use(User.googleStrategy());   // Comment out this line if you don't want to enable login via Google
//passport.use(User.linkedInStrategy()); // Comment out this line if you don't want to enable login via LinkedIn

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

require('./server/routes.js')(app);

app.set('port', process.env.PORT || 8000);
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
