define(['module', 'express', 'http', 'mongoose', 'passport', 'path', 'less-middleware',
    './routes', './models/User'],
    function (module, express, http, mongoose, passport, path, lessMiddleware, routes, User) {
        "use strict";

        var __dirname = module.uri.split('/').slice(0, -1).join('/') + '/';

        var resetDB = ( process.env.RESETDB || false );

        var app = express();

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

        app.set('views', __dirname + '../client/views');
        app.set('view engine', 'jade');
        app.use(express.logger('dev'))
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(lessMiddleware({ src: __dirname + '../client', compress: true }));
        app.use(express.static(path.join(__dirname, '../client')));
        console.log('the uri is');
        console.log(module.uri);
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

        routes(app);

        app.set('port', process.env.PORT || 8000);
        return app;
    })
