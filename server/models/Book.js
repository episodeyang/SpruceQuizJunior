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

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        return {

            add: function (data, callback) {

                function createNewUser() {
                    var book = new BookM(data);
                    book.save(function (err) {
                        if (err) {
                            return callback(err);
                        } else {
                            return callback(null, userFull);
                        }
                    });
                }

                createNewUser();
            },

            confirmEmail: function (username, code, email, callback) {
                UserM.findOne(
                    {username: username},
                    function (err, user) {
                        if (!user || err) {
                            console.log('User.confirmEmail error: user'+ user + ' error' + err)
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
            }
        };

    });


