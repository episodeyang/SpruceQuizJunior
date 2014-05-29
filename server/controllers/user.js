/**
 * @fileOverview User Controller
 * @module User
 * @type {exports}
 * Registration and validation for authentication takes place in the
 * Auth controller and User model.
 * This `UserCtrl` module takes care of non-auth, API-related user
 * operations, such as
 *          user.index(),
 *          user.remove(:id),
 *          user.addSection(),
 *          user.addSchool(),
 *          user.addTutor(),
 *          etc.,
 * good luck coding!
 */
define(['underscore', 'async', '../models/SchemaModels', '../models/User', '../models/Session', '../models/Book', '../rolesHelper'],
    function (_, async, SchemaModels, UserM, SessionM, BookM, rolesHelper) {
        "use strict";
        var userRoles = rolesHelper.userRoles,
            accessLevels = rolesHelper.accessLevels;

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        return {
            /**
             * @api {get} /user/:id Request User information
             * @apiName GetUser
             * @apiGroup User
             *
             * @apiParam {Number} id Users unique ID.
             *
             * @apiSuccess {String} firstname Firstname of the User.
             * @apiSuccess {String} lastname  Lastname of the User.
             *
             * @apiSuccessExample Success-Response:
             *     HTTP/1.1 200 OK
             *     {
             *       "firstname": "John",
             *       "lastname": "Doe"
             *     }
             *
             * @apiError UserNotFound The id of the User was not found.
             *
             * @apiErrorExample Error-Response:
             *     HTTP/1.1 404 Not Found
             *     {
             *       "error": "UserNotFound"
             *     }
             */
            //This is mostly experimental, since no testing spec is in place yet.
            index: function (req, res) {
                var users;
                UserM.find({$where: "this.role.title == 'student'"}, function (err, results) {
                    users = results;
                    _.each(users, function (user) {
                        delete user.password;
                    });
//                    console.log(users);
                    res.json(users);
                });
            },
            /**
             * @api {delete} /user/:id Request User information
             * @apiName DeleteUser
             * @apiGroup User
             *
             * @apiParam {Number} id Users unique ID.
             *
             * @apiSuccess {String} @todo need to complete
             *
             * @apiSuccessExample Success-Response:
             *     HTTP/1.1 200 OK
             *     {
             *       "firstname": "John",
             *       "lastname": "Doe"
             *     }
             *
             * @apiError UserNotFound The id of the User was not found.
             *
             * @apiErrorExample Error-Response:
             *     HTTP/1.1 404 Not Found
             *     {
             *       "error": "UserNotFound"
             *     }
             */
            remove: function (req, res) {
                UserM.remove({ id: req.params.uuid }, function (err) {
                    if (err) {
                        res.send(404, "Remove user failed.");
                    }
                });
            },
            findOne: function (req, res) {
                var query = {
                        username: req.params.username
                    },
                    userObject;

                function sendSubDoc(error, user) {
                    var userFull = {};
                    if (error) {
                        console.log(error);
                        return res.send(500, 'no' + capitalize(user.role.title) + 'Found' + error);
                    }
                    // the ordering of the extension matters here,
                    // because we want to keep the _id field of the usrRoot,
                    // not the student/teacher/admin etc. subdoc.
                    // UPDATE: A safer thing to to is to just get rid of the _id
                    // field all together.
                    _.extend(userFull, user.toObject(), userObject);
                    delete userFull._id;
                    return res.json(200, userFull);
                }

                function callback(error, user) {
                    if (error || !user) {
                        console.log(error);
                        return res.send(404, 'noUserFound' + error);
                    }
                    userObject = user.toObject();

                    SchemaModels[capitalize(user.role.title)]
                        .findOne(query).populate('books sessions').exec(sendSubDoc);
                }

                UserM.findOne(query).select('_id username role name').exec(callback);
            },
            update: function (req, res) {
                if (!req.params.username) {
                    return res.send(400, "noUserSpecified");
                }
                if (!req.body.role || !req.body.role.title) {
                    console.log("no role entry in user payload");
                    return res.send(401, 'needRoleInUserPayload');
                }

                function callback(err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(500, err);
                    }
                    doc.populate('sessions schools books', responseCallback);
                    // responseCallback();
                }

                function responseCallback(err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(500, err);
                    }
                    // the ordering of the extension matters here,
                    // because we want to keep the _id field of the user object,
                    // not the student/teacher doc etc.
                    var user = _.extend({}, doc.toObject(), req.body);
                    delete user._id;
                    return res.send(201, user);
                }

                var query = {
                        username: req.params.username
                    },
                // to avoid overwriting student/teacher _id with user._id
                    update = _.omit(req.body, ['_id', 'schools', 'sessions', 'books']);

                SchemaModels[capitalize(req.body.role.title)]
                    .findOneAndUpdate(
                    query,
                    update,
                    callback
                );

                if (update.name !== req.user.name) {
                    UserM.findOneAndUpdate(
                        query,
                        update
                    );
                }
            },
            getSessions: function (req, res) {
                if (!req.params.username) {
                    return res.send(400, "noUserSpecified");
                }
                function done(err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(500, err);
                    }
                    return res.send(200, doc);
                }

                if (req.params.username == req.user.username) {
                    return UserM.getSet('sessions', req.user, done);
                }

                var query = { username: req.params.username };
                return UserM.findOne(query).exec(function (error, user) {
                    if (error) {
                        console.log(error);
                        return res.send(500, error);
                    } else if (!user) {
                        return res.send(404, 'userNotFound');
                    }
                    UserM.getSet('sessions', user, done);
                });
            },
            getSchools: function (req, res) {
                if (!req.params.username) {
                    return res.send(400, "noUserSpecified");
                }
                function done(err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(500, err);
                    }
                    return res.send(200, doc);
                }

                if (req.params.username == req.user.username) {
                    return UserM.getSet('schools', req.user, done);
                }

                var query = { username: req.params.username };
                return UserM.findOne(query).exec(function (error, user) {
                    if (error) {
                        console.log(error);
                        return res.send(500, error);
                    } else if (!user) {
                        return res.send(404, 'userNotFound');
                    }
                    UserM.getSet('schools', user, done);
                });
            },
            getBooks: function (req, res) {
                if (!req.params.username) {
                    return res.send(400, "noUserSpecified");
                }
                function done(err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(500, err);
                    }
                    return res.send(200, doc);
                }

                if (req.params.username == req.user.username) {
                    return UserM.getSet('books', req.user, done);
                }

                var query = { username: req.params.username };
                return UserM.findOne(query).exec(function (error, user) {
                    if (error) {
                        console.log(error);
                        return res.send(500, error);
                    } else if (!user) {
                        return res.send(404, 'userNotFound');
                    }
                    UserM.getSet('books', user, done);
                });
            },
            /**
             * take in inpurt of the form:
             * req: {
             *          add: {
             *                  _id: <ObjectId>,
             *               }
             *       }
             * @param req
             * @param res
             * @returns {*}
             */
            updateSessions: function (req, res) {
                if (!req.params.username) {
                    return res.send(400, "noUserSpecified");
                } else if (!req.body.add && !req.body.remove) {
                    return res.send(400, "needAddOrRemoveInBody");
                }

                var user;
                if (req.params.username === req.user.username || req) {
                    // One can always add sessions to oneself.
                    // in testing the user does not have toObject() method;
                    // this is to prevent passing in the doc object, and cause callStack overflow.
                    if (req.user.toObject) {
                        user = req.user.toObject();
                    } else {
                        user = req.user;
                    }
                } else if (accessLevels.admin.bitMask & req.user.role.bitMask) {
                    //Only admins can add sessions to other students.
                    //Todo: add more fine-grained control to school administrators.
                    user = {
                        username: req.params.username
                    };
                } else if (req.user.role.title === 'parent') {
                    //todo: add parental support for children management.
                    return res.send(401, 'notAuthorized');
                } else {
                    return res.send(401, 'notAuthorized');
                }

                function getUser(next) {
                    UserM.getRef(user, 'name username', next);
                }
                function updateSession(user, next) {
                    var userObject = user.toObject();
                    if (req.body.add) {
                        if (req.body.teacher) {
                            SessionM.addTeacher(req.body.add, userObject, next);
                        } else {
                            SessionM.addMember(req.body.add, userObject, next);
                        }
                    } else if (req.body.remove) {
                        delete userObject.name;
                        if (req.body.teacher) {
                            SessionM.removeTeacher(req.body.remove, userObject, next);
                        } else {
                            SessionM.removeMember(req.body.remove, userObject, next);
                        }
                    }
                }
                function updateUser(session, next) {
                    if (req.body.add) {
                        return UserM.addSession(user, req.body.add, next);
                    } else if (req.body.remove) {
                        return UserM.removeSession(user, req.body.remove, next);
                    }
                }

                function callback(error, session) {
                    if (error) {
                        console.log(error);
                        return res.send(500, error);
                    }
                    return res.send(201, session);
                }

                async.waterfall([getUser, updateSession, updateUser], callback);
            },
            updateBooks: function (req, res) {
                if (!req.params.username) {
                    return res.send(400, "noUserSpecified");
                } else if (!req.body.add && !req.body.remove) {
                    return res.send(400, "needAddOrRemoveInBody");
                }

                var user;
                if (req.params.username === req.user.username || req) {
                    //One can always add sessions to oneself.
                    user = req.user;
                } else if (accessLevels.admin.bitMask & req.user.role.bitMask) {
                    //Only admins can add sessions to other students.
                    //Todo: add more fine-grained control to school administrators.
                    user = {
                        username: req.params.username
                    };
                } else if (req.user.role.title === 'parent') {
                    //todo: add parental support for children management.
                    return res.send(401, 'notAuthorized');
                } else {
                    return res.send(401, 'notAuthorized');
                }

                function getUser(next) {
                    UserM.getRef(user, 'name username', next);
                }
                function updateBook(user, next) {
                    var userObject = user.toObject();
                    if (req.body.add) {
                        if (req.body.admin) {
                            BookM.addAdmin(req.body.add, userObject, next);
                        } else {
                            BookM.addMember(req.body.add, userObject, next);
                        }
                    } else if (req.body.remove) {
                        delete userObject.name;
                        if (req.body.admin) {
                            BookM.removeAdmin(req.body.remove, userObject, next);
                        } else {
                            BookM.removeMember(req.body.remove, userObject, next);
                        }
                    }
                }
                function updateUser(book, next) {
                    if (req.body.add) {
                        UserM.addBook(user, req.body.add, next);
                    } else if (req.body.remove) {
                        UserM.removeBook(user, req.body.remove, next);
                    }
                }

                function callback(error, doc) {
                    if (error) {
                        return res.send(500, error);
                    }
                    return res.send(201, doc);
                }

                async.waterfall([getUser, updateBook, updateUser], callback);
            },
            updateSchools: function (req, res) {
                return res.send(501, "notImplemented");
            }
        };
    });
