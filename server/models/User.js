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

        var UserFeed = SchemaModels.UserFeed;

        function dictParser(string) {
            /**
             * convert `#` separated string to a dictionary
             * @param {String} string something like: "user@email.com#code:14a3b23#username:username"
             * @return {object} output dictionary - something like: { email: <email>, otherKey: value}
             */
            var strList = string.split('#');
            var params = { email: strList.shift() };

            function pushKey(item) {
                params[item.split(':')[0]] = item.split(':')[1];
            }

            _.each(strList, pushKey);
            return params;
        }


        function dictMaker(data) {
            /**
             * convert a dictionary to `#` separated string
             * @param {object} data
             * @return {string} string
             */
            function makeString(value, key) {
                if (value) {
                    return "#" + key + ":" + value;
                }
            }

            // add the `#` inside the makeString for better
            // null value handling and default `#` prefix.
            return _.map(data, makeString).join('');
        }

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        var UserMethods = {

            addUser: function (username, password, role, params, callback) {

                function createNewUser() {
                    var user = new UserM({
                        username: username,
                        password: password,
                        role: role,
                        name: params.name,
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
                        DOB: params.DOB,
                        gender: params.gender,
                        domainName: params.domain
                    };
                    if (params.schoolName) {
                        subUser.schools = [params.schoolName];
                    }

                    console.log("subUser");
                    console.log(subUser);

                    function validate(user) {
                        return true;
                    }

                    if (!validate(subUser)) {
                        return callback('badRequest');
                    }

                    var userObject = {};
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
            getRef: function (user, fieldString, callback) {
                SchemaModels[capitalize(user.role.title)].findOne({username: user.username}).select(fieldString).exec(callback);
            },
            confirmEmail: function (username, code, email, callback) {
                UserM.findOne(
                    {username: username},
                    function (err, user) {
                        if (!user || err) {
                            console.log('User.confirmEmail error: user' + user + ' error' + err)
                            return callback('userDoesNotExist');
                        }
                        user.populate(user.role.title, function (err, user) {
                            //console.log('show returned user object');
                            //console.log(user);

                            var userEmail = user[user.role.title].email;
                            var params = dictParser(userEmail);

                            if (!params.code) {
                                return callback('emailAlreadyActivated');
                            }

                            if (params.code !== code) {
                                return callback('invalidCode');
                            }
                            if (code === params.code && email === params.email && username === user.username) {
                                SchemaModels[capitalize(user.role.title)].findOneAndUpdate(
                                    {username: username},
                                    {email: email},
                                    function (err, user) {
                                        return callback(null, 'emailConfirmed');
                                    }
                                );
                            }
                        });
                    }
                );
            },

            validate: function (user) {
                check(user.username, 'Username must be 1-20 characters long').len(1, 20);
                check(user.password, 'Password hash is length 64').len(64);
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
            },
            //not used not tested
            getSet: function (key, user, callback) {
                if (!user.role) {
                    return callback('noUserRole');
                }
                var query = {
                    username: user.username
                };
                SchemaModels[capitalize(user.role.title)].findOne(query).select(key).populate(key).exec(callback);
            },
            addOrRemoveFromSet: function (key, addOrRemove, user, payload, callback) {
                if (!user.role) {
                    return callback('noUserRole');
                } else if (!payload._id) {
                    return callback('noPayload._id');
                }
                function done(error, doc) {
                    if (error) {
                        console.log(error);
                        return error;
                    }
                    doc.populate(key, callback);
                }

                var query = {
                        username: user.username
                    },
                    options = {
                        new: true, //return updated document
                        select: key
                    };
                var update;
                if (addOrRemove === "add") {
                    update = {
                        $addToSet: {}
                    };
                    update.$addToSet[key] = payload._id;
                } else if (addOrRemove === "pull") {
                    update = {
                        $pullAll: {}
                    };
                    update.$pullAll[key] = [payload._id];
                }
//                console.log(update);
                SchemaModels[capitalize(user.role.title)]
                    .findOneAndUpdate(
                    query,
                    update,
                    options,
                    done
                );
            },
            addSession: function (user, session, callback) {
                UserMethods.addOrRemoveFromSet('sessions', 'add', user, session, callback);
            },
            removeSession: function (user, session, callback) {
                UserMethods.addOrRemoveFromSet('sessions', 'pull', user, session, callback);
            },
            //todo: not tested;
            addSchool: function (user, school, callback) {
                UserMethods.addOrRemoveFromSet('sessions', 'add', user, school, callback);
            },
            removeSchool: function (user, school, callback) {
                UserMethods.addOrRemoveFromSet('sessions', 'pull', user, school, callback);
            },
            addBook: function (user, book, callback) {
                UserMethods.addOrRemoveFromSet('books', 'add', user, book, callback);
            },
            removeBook: function (user, book, callback) {
                UserMethods.addOrRemoveFromSet('books', 'pull', user, book, callback);
            },
            updateReputation: function (user, score, callback) {
                var query = {
                        username: user.username
                    },
                    update = {
                        $inc: {reputation: score}
                    };

                if (user.role && user.role.title) {
                    return SchemaModels[capitalize(user.role.title)].findOneAndUpdate(
                        query,
                        update,
                        callback
                    );
                } else {
                    return Users
                        .findOne(query)
                        .exec(function (error, user) {
                            if (error || !user.role) {return callback(error); }
                            return SchemaModels[capitalize(user.role.title)]
                                .findOneAndUpdate(
                                    query,
                                    update,
                                    callback
                                );
                        });
                }
            }
        };
        return _.extend(UserM, UserMethods);
    });


