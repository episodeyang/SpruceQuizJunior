'use strict';
/**
 * @fileOverview User Model
 * @memberOf User
 * @type {exports}
 */

define(['crypto', 'underscore', 'passport', 'passport-local', 'validator', '../rolesHelper',
        './SchemaModels'],
    function (crypto, _, passport, passportLocal, validator, rolesHelper, SchemaModels) {
        var LocalStrategy = passportLocal.Strategy;
        var userRoles = rolesHelper.userRoles;
        var UserM = SchemaModels.User
            , StudentM = SchemaModels.Student
            , ParentM = SchemaModels.Parent
            , TeacherM = SchemaModels.Teacher
            , AdminM = SchemaModels.Admin
            , SuperadminM = SchemaModels.Superadmin;
        var check = validator.check;

        function keyParser(string) {
            /**
             * takes in a string that looks like:
             * @param {String} input string - something like: "user@email.com#code:14a3b23#username:username"
             * @return {object} output dictionary - something like: { email: <email>, otherKey: value}
             */
            var strList = string.split('#');
            var params = { email: strList.shift() };
            function pushKey (item) {
                params[item.split(':')[0]] = item.split(':')[1];
            };
            _.each(strList, pushKey);
            return params;
        }

        return {

            addUser: function (username, password, role, params, callback) {

                function createNewUser() {
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

                    var email = params.email + '#code:' + crypto.createHash('sha1').digest('hex');
                    var subUser = {
                        name: params.name,
                        username: username,
                        email: email,
                        DOB: params.DOB
                    };

                    var userObject;
                    if (role.bitMask === userRoles.student.bitMask) {
                        userObject = new StudentM(subUser);
                        userObject.save();
                        user.student = userObject._id;
                    } else if (role.bitMask === userRoles.parent.bitMask) {
                        userObject = new ParentM(subUser);
                        userObject.save();
                        user.parent = userObject._id;
                    } else if (role.bitMask === userRoles.teacher.bitMask) {
                        userObject = new TeacherM(subUser);
                        userObject.save();
                        user.teacher = userObject._id;
                    } else if (role.bitMask === userRoles.admin.bitMask) {
                        userObject = new AdminM(subUser);
                        userObject.save();
                        user.admin = userObject._id;
                    } else if (role.bitMask === userRoles.superadmin.bitMask) {
                        userObject = new SuperadminM(subUser);
                        userObject.save();
                        user.superadmin = userObject._id;
                    } else {
                        return callback('InvalidRole.' + role.title);
                    }

                    user.save(function (err) {
                        if (err) {
                            console.log("An error occurred in saving new user to database.");
                        } else {
                            //console.log('subUser object')
                            //console.log(subUser)
                            user.populate(user.role.title, function (err, userFull) {
                                return callback(null, userFull);
                            });
                        }
                    });
                }
                UserM.findOne({ username: username }, function (err, duplicate) {
                    if (err) {
                        console.log("An error occurred in checking User database.");
                    } else if (duplicate) {
                        console.log("User already exists");
                        return callback("UserAlreadyExists");
                    } else {
                        createNewUser();
                    }
                });
            },

            confirmEmail: function (username, code, email, callback) {
                UserM.findOne(
                    {username: username},
                    function (err, user) {
                        user.populate(user.role.title, function (err, user) {
                            //var reg = new RegExp(/@.+#code:(\w+)/);

                            //console.log('show returned user object');
                            //console.log(user);

                            if (user === undefined) {
                                return callback('userDoesNotExist');
                            }
                            var userEmail = user[user.role.title].email;
                            var params = keyParser(userEmail);

                            if (params.code === undefined) {
                                return callback('emailAlreadyConfirmed.');
                            }
                            if (code == params.code && email == params.email && username == user.username) {
                                user[user.role.title].email = params.email;
                                user.save();
                                return callback(null, 'emailConfirmed');
                            }
                        });
                    }
                );
                callback();

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
                done(null, user.id);
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


