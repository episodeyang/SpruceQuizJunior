'use strict';
/**
 * @fileOverview User Model
 * @memberOf User
 * @type {exports}
 */

define(['underscore', 'passport', 'passport-local', 'validator', '../rolesHelper',
    './SchemaModels'],
    function (_, passport, passportLocal, validator, rolesHelper, SchemaModels) {
        var LocalStrategy = passportLocal.Strategy;
        var userRoles = rolesHelper.userRoles;
        var UserM = SchemaModels.User
            , StudentM = SchemaModels.Student
            , ParentM = SchemaModels.Parent
            , TeacherM = SchemaModels.Teacher
            , AdminM = SchemaModels.Admin
            , SuperadminM = SchemaModels.Superadmin;
        var check = validator.check;

        return {
            addUser: function (username, password, role, params, callback) {
                UserM.findOne({ username: username }, function (err, duplicate) {
                    if (err) {
                        console.log("An error occurred in checking User database.");
                    } else {
                        if (duplicate) {
                            console.log("User already exists");
                            return callback("UserAlreadyExists");
                        } else {
                            var user = new UserM({
                                username: username,
                                password: password,
                                role: role,
                                student: null,
                                parent: null,
                                teacher: null,
                                admin: null,
                                superadmin: null
                            });
                            var userObject;
                            if (role.bitMask === userRoles.student.bitMask) {
                                userObject = new StudentM({
                                    name: params.name,
                                    DOB: params.DOB,
                                    email: params.email
                                });
                                userObject.save();
                                user.student = userObject._id;
                            } else if (role.bitMask === userRoles.parent.bitMask) {
                                userObject = new ParentM({
                                    name: params.name,
                                    email: params.email
                                });
                                userObject.save();
                                user.parent = userObject._id;
                            } else if (role.bitMask === userRoles.teacher.bitMask) {
                                userObject = new TeacherM({
                                    name: params.name,
                                    email: params.email
                                });
                                userObject.save();
                                user.teacher = userObject._id;
                            } else if (role.bitMask === userRoles.admin.bitMask) {
                                userObject = new AdminM({
                                    name: params.name,
                                    email: params.email
                                });
                                userObject.save();
                                user.admin = userObject._id;
                            } else if (role.bitMask === userRoles.superadmin.bitMask) {
                                userObject = new SuperadminM({
                                    name: params.name,
                                    email: params.email
                                });
                                userObject.save();
                                user.superadmin = userObject._id;
                            } else {
//                        console.log("/register invalid role");
//                        console.log(role);
                                return callback('InvalidRole.' + role.title);
                            }
//                    user.userId =userObject.id;
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

            validate: function (user) {
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
                function (username, password, done) {
                    UserM.findOne({ username: username }, function (err, user) {
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

            serializeUser: function (user, done) {
                user.userId = user._id;//temp code, for debug reason, need to remove right away.
                done(null, user._id);
//        done(null, user.userId);
            },

            deserializeUser: function (id, done) {
                UserM.findOne({ _id: id }, function (err, user) {
                    if (user) {
                        done(null, user);
                    }
                    else {
                        done(null, false);
                    }
                });
            }
        };

    });


