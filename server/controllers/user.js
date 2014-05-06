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
define(['underscore', '../models/SchemaModels', '../models/User', '../rolesHelper'],
    function (_, SchemaModels, UserM, rolesHelper) {
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
                    userRoot = {};

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
                    _.extend(userFull, user.toObject(), userRoot);
                    delete userFull._id;
                    return res.json(200, userFull);
                }

                function callback(error, user) {
                    if (error) {
                        console.log(error);
                        res.send(404, 'noUserFound' + error);
                    }
                    userRoot = user.toObject();

                    SchemaModels[capitalize(user.role.title)]
                        .findOne(query).exec(sendSubDoc);
                }

                UserM.findOne(query).select('_id username role').populate('books sessions schools').exec(callback);
            },
            update: function (req, res) {

                if (!req.body.role || !req.body.role.title) {
                    console.log("no role entry in user payload");
                    return res.send(401, 'needRoleInUserPayload');
                }

                function callback(err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(401, err);
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
                    update = _.omit(req.body, '_id');

                SchemaModels[capitalize(req.body.role.title)]
                    .findOneAndUpdate(
                    query,
                    update,
                    callback
                );
            },
            addSession: function (req, res) {
                if (!req.params.username) {
                    return res.send(400, "noUserSpecified");
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

                function callback(error, doc) {
                    if (error) {
                        return res.send(500, error);
                    }
                    return res.send(201, doc);
                }

                UserM.addSession(user, req.body, callback);
            },
            addBook: function (req, res) {
                if (!req.params.username) {
                    return res.send(400, "noUserSpecified");
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

                function callback(error, doc) {
                    if (error) {
                        return res.send(500, error);
                    }
                    return res.send(201, doc);
                }

                UserM.addBook(user, req.body, callback);
            },
            addSchool: function (req, res) {
                return res.send(501, "notImplemented");
            }
        };
    });
