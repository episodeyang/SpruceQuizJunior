/**
 * @module AuthCtrl
 * @name auth
 */
'use strict';
define(['underscore', 'passport', '../models/User', '../mailer/mailer', '../models/SchemaModels'],
    function (_, passport, User, mailer, SchemaModels) {
        var StudentM = SchemaModels.Student;
        var ParentM = SchemaModels.Parent;
        var TeacherM = SchemaModels.Teacher;
        var AdminM = SchemaModels.Admin;
        var SuperadminM = SchemaModels.Superadmin;

        return {
            /**
             * @name register
             * @function
             * @param req
             * @param res
             * @param next
             * @returns {*}
             */
            register: function (req, res, next) {
                try {
                    User.validate(req.body);
                } catch (err) {
                    return res.send(400, err.message);
                }

                function loginCallback (err, user) {
                    if (err === 'UserAlreadyExists') return res.send(403, "UserAlreadyExists");
                    else if (err)                    return res.send(500);


                    if (user[user.role.title].email) {
                        var locals = {
                            username: user.username,
                            email: user[user.role.title].email.split('#')[0],
                            code: user[user.role.title].email.match(new RegExp(/@.+#code:(\w+)/))[1],
                            name: user[user.role.title].name.split(',').join(''),
                            domain: req.headers.host,
                            info: req.body.info
                        };

                        mailer.register(
                            locals.email,
                            locals,
                            function (error, response) {
                                if (response.message && response.messageId) {
                                    //todo: add #sent tag to the user email entry.
                                    //user.email = user.email + "#sent:true";
                                } else {
                                    console.log('mariler.register:noResponseMessage');
                                }
                            }
                        );
                    }


                    // the passport custom callback
                    req.logIn(user, function (err) {
                        if (err) {
                            next(err);
                        } else {
                            res.json(201, { "role": user.role, "username": user.username, "id": user._id});

                        }
                    });
                }

                var params = _.extend({doman: req.headers.host}, req.body.params);
                User.addUser(
                    req.body.username,
                    req.body.password,
                    req.body.role,
                    params,
                    loginCallback
                );
            },
            registerBatch: function (req, res, next) {
                try {
                    User.validate(req.body);
                } catch (err) {
                    return res.send(400, err.message);
                }

                function loginCallback (err, user) {
                    if (err === 'UserAlreadyExists') return res.send(403, "UserAlreadyExists");
                    else if (err)                    return res.send(500);


                    if (user[user.role.title].email) {
                        console.log(user[user.role.title].email);
                        var locals = {
                            username: user.username,
                            email: user[user.role.title].email.split('#')[0],
                            code: user[user.role.title].email.match(new RegExp(/@.+#code:(\w+)/))[1],
                            name: user[user.role.title].name.split(',').join(''),
                            domain: req.headers.host,
                            info: req.body.info
                        };

                        mailer.register(
                            locals.email,
                            locals,
                            function (error, response) {
                                if (response.message && response.messageId) {
                                    //todo: add #sent tag to the user email entry.
                                    //user.email = user.email + "#sent:true";
                                } else {
                                    console.log('mariler.register:noResponseMessage');
                                }
                            }
                        );
                    }

                    res.send(201, { "role": user.role, "username": user.username, "id": user._id});
                }

                var params = _.extend({doman: req.headers.host}, req.body.params);
                User.addUser(
                    req.body.username,
                    req.body.password,
                    req.body.role,
                    params,
                    loginCallback
                );
            },

            login: function (req, res, next) {
                passport.authenticate('local', function (err, user) {

                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        return res.send(400);
                    }
                    req.logIn(user, function (err) {
                        if (err) {
                            return next(err);
                        }

                        if (req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                        res.json(200, { "role": user.role, "username": user.username, "id": user._id});
                    });
                })(req, res, next);
            },

            logout: function (req, res) {
                req.logout();
                res.send(200);
            }
        };
    });

