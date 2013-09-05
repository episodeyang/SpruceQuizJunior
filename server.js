require('nodetime').profile({
    accountKey: 'cb0835da7eb6304c00877ca11569df1ef72ebb10',
    appName: 'Node.js Application'
});

var express =       require('express')
    , http =        require('http')
    , mongoose =    require('mongoose')
    , passport =    require('passport')
    , path =        require('path')
    , User =        require('./server/models/User.js')
    , Problem =     require('./server/models/Problem.js')
    , Student =     require('./server/models/Student.js')
    , Teacher =     require('./server/models/Teacher.js')
    , School =     require('./server/models/School.js')
    , Section =     require('./server/models/Section.js')
    , Unit =     require('./server/models/Unit.js')
    , Material =     require('./server/models/Material.js')
    , Exam  =     require('./server/models/Exam.js')
    , Quiz  =     require('./server/models/Quiz.js')
    , Feed  =     require('./server/models/Feed.js');


var app = express();

mongoose.connect('mongodb://localhost/sprucedb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connected to Spruce database');
});

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'))
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
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
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
