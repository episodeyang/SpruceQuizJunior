var User
    , _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy
    , GoogleStrategy = require('passport-google').Strategy
    , LinkedInStrategy = require('passport-linkedin').Strategy
    , check =           require('validator').check
    , userRoles =       require('../../client/js/routingConfig').userRoles;

var UserM = require('./SchemaModels').User
    , StudentM = require('./SchemaModels').Student
    , TeacherM = require('./SchemaModels').Teacher;

module.exports = {
    addUser: function(username, password, role, callback) {
        UserM.findOne({ username: username }, function (err, duplicate) {
            if (err) {
                console.log("An error occurred in checking User database.");
            } else {
                if(duplicate) {
                    console.log("User already exists");
                    return callback("UserAlreadyExists");
                } else {
                    var user = new UserM({
                        username:   username,
                        password:   password,
                        role:       role,
                        userId:     null
                    });
                    var tempobject;
                    if(role === 2) {
                        tempobject = new StudentM();
                        tempobject.save();
                    } else if(role === 4) {
                        tempobject = new ParentM();
                        tempobject.save();
                    } else if(role === 8) {
                        tempobject = new TeacherM();
                        tempobject.save();
                    } else if(role === 16) {
                        tempobject = new AdminM();
                        tempobject.save();
                    } else if(role === 32) {
                        tempobject = new SuperadminM();
                        tempobject.save();
                    } else {
                        console.log("Not a valid role number!");
                    }
                    user.userId = tempobject._id;
                    user.save(function (err) {
                        if (err) {
                            console.log("An error occurred in saving new user to database.");
                        } else {
                            return callback(null, user);
                        }
                    });
                }
            }
        });
    },

    // findOrCreateOauthUser: function(provider, providerId) {
    //     var user = module.exports.findByProviderId(provider, providerId);
    //     if(!user) {
    //         user = {
    //             id: _.max(users, function(user) { return user.id; }).id + 1,
    //             username: provider + '_user', // Should keep Oauth users anonymous on demo site
    //             role: userRoles.user,
    //             provider: provider
    //         };
    //         user[provider] = providerId;
    //         users.push(user);
    //     }

    //     return user;
    // },

    // findAll: function() {
    //     return _.map(users, function(user) { return _.clone(user); });
    // },

    // findById: function(id) {
    //     return _.clone(_.find(users, function(user) { return user.id === id }));
    // },

    // findByUsername: function(username) {
    //     return _.clone(_.find(users, function(user) { return user.username === username; }));
    // },

    // findByProviderId: function(provider, id) {
    //     return _.find(users, function(user) { return user[provider] === id; });
    // },

    validate: function(user) {
        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
        check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
        // Till this is rectified Number arrays must be converted to string arrays
        // https://github.com/chriso/node-validator/issues/185
        //var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
        var stringArr = [ '1', '2', '4', '8'];
        //console.log(stringArr);
        check(user.role, 'Invalid user role given').isIn(stringArr);
    },

    localStrategy: new LocalStrategy(
        function(username, password, done) {
            UserM.findOne({ username: username }, function(err, user) {
                if (err) { 
                    return done(err); 
                }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                } else if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                } else {
                    return done(null, user);
                }
            });
        }
    ),

    // twitterStrategy: function() {
    //     if(!process.env.TWITTER_CONSUMER_KEY)    throw new Error('A Twitter Consumer Key is required if you want to enable login via Twitter.');
    //     if(!process.env.TWITTER_CONSUMER_SECRET) throw new Error('A Twitter Consumer Secret is required if you want to enable login via Twitter.');

    //     return new TwitterStrategy({
    //         consumerKey: process.env.TWITTER_CONSUMER_KEY,
    //         consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    //         callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:8000/auth/twitter/callback'
    //     },
    //     function(token, tokenSecret, profile, done) {
    //         var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id);
    //         done(null, user);
    //     });
    // },

    // facebookStrategy: function() {
    //     if(!process.env.FACEBOOK_APP_ID)     throw new Error('A Facebook App ID is required if you want to enable login via Facebook.');
    //     if(!process.env.FACEBOOK_APP_SECRET) throw new Error('A Facebook App Secret is required if you want to enable login via Facebook.');

    //     return new FacebookStrategy({
    //         clientID: process.env.FACEBOOK_APP_ID,
    //         clientSecret: process.env.FACEBOOK_APP_SECRET,
    //         callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:8000/auth/facebook/callback"
    //     },
    //     function(accessToken, refreshToken, profile, done) {
    //         var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id);
    //         done(null, user);
    //     });
    // },

    // googleStrategy: function() {

    //     return new GoogleStrategy({
    //         returnURL: process.env.GOOGLE_RETURN_URL || "http://localhost:8000/auth/google/return",
    //         realm: process.env.GOOGLE_REALM || "http://localhost:8000/"
    //     },
    //     function(identifier, profile, done) {
    //         var user = module.exports.findOrCreateOauthUser('google', identifier);
    //         done(null, user);
    //     });
    // },

    // linkedInStrategy: function() {
    //     if(!process.env.LINKED_IN_KEY)     throw new Error('A LinkedIn App Key is required if you want to enable login via LinkedIn.');
    //     if(!process.env.LINKED_IN_SECRET) throw new Error('A LinkedIn App Secret is required if you want to enable login via LinkedIn.');

    //     return new LinkedInStrategy({
    //         consumerKey: process.env.LINKED_IN_KEY,
    //         consumerSecret: process.env.LINKED_IN_SECRET,
    //         callbackURL: process.env.LINKED_IN_CALLBACK_URL || "http://localhost:8000/auth/linkedin/callback"
    //       },
    //        function(token, tokenSecret, profile, done) {
    //         var user = module.exports.findOrCreateOauthUser('linkedin', profile.id);
    //         done(null,user);
    //       }
    //     );
    // },
    serializeUser: function(user, done) {
        //console.log(user);
        done(null, user.userId);
    },

    // deserializeUser: function(id, done) {
    //     var user = module.exports.findById(id);

    //     if(user)    { done(null, user); }
    //     else        { done(null, false); }
    // }

    deserializeUser: function(id, done) {
        UserM.findOne({ userId: id }, function(err, user) {
            if(user)    { done(null, user); }
            else        { done(null, false); }
        });
    }
};