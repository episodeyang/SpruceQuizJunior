'use strict';

var User
    , _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy;
//    , TwitterStrategy = require('passport-twitter').Strategy
//    , FacebookStrategy = require('passport-facebook').Strategy
//    , GoogleStrategy = require('passport-google').Strategy
//    , LinkedInStrategy = require('passport-linkedin').Strategy
var check =           require('validator').check
    , userRoles =       require('../../client/js/rolesHelper').userRoles;

var UserM = require('./SchemaModels').User
    , StudentM = require('./SchemaModels').Student
    , TeacherM = require('./SchemaModels').Teacher
    , SuperadminM= require('./SchemaModels').Superadmin;

module.exports = {
    addUser: function(username, password, role, params, callback) {
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
                    var userObject;
                    if (role.bitMask === 2) {
                        userObject = new StudentM({
                            name: params.name,
                            DOB: params.DOB,
                            email: params.email,
                            sections: [],
                            schools: [],
                            exams: [],
                            mistakeTags: [],
                            errata: [],
                            comments: '',
                            preferences: {
                                problemNoteListLimit: 1,
                                anotherPreference: 'test reference'
                            }
                        });
//                        userObject.save();
                    } else if (role.bitMask=== 4) {
                        userObject = new ParentM();
                        userObject.save();
                    } else if (role.bitMask=== 8) {
                        userObject = new TeacherM();
                        userObject.save();
                    } else if (role.bitMask=== 16) {
                        userObject = new AdminM();
                        userObject.save();
                    } else if (role.bitMask=== 32) {
                        userObject = new SuperadminM({superadminName: ''});
                        userObject.save();
                    } else {
                        console.log("Not a valid role number!");
                        console.log(role);
                    }
                    //user.userId =userObject.id;
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


    validate: function(user) {
        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
        check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
        // Till this is rectified Number arrays must be converted to string arrays
        // https://github.com/chriso/node-validator/issues/185
        //var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
        var stringArr = [ '1', '2', '4', '8', '16', '32', '64'];
        //console.log(stringArr);
        check(user.role.bitMask, 'Invalid user role given').isIn(stringArr);
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

    serializeUser: function(user, done) {
        //console.log(user);
        user.userId = user._id;//temp code, for debug reason, need to remove right away.
        done(null, user._id);
//        done(null, user.userId);
    },

    deserializeUser: function(id, done) {
//        UserM.findOne({ userId: id }, function(err, user) {
        UserM.findOne({ _id: id }, function(err, user) {
            if(user)    { done(null, user); }
            else        { done(null, false); }
        });
    }
};