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
define(['underscore', '../models/SchemaModels', '../rolesHelper', '../models/Session.js', '../models/Question.js'],
    function (_, SchemaModels, rolesHelper, SessionM, QuestionM) {
        "use strict";
        var UserM = SchemaModels.User;
        var userRoles = rolesHelper.userRoles;
        var keyString = '_id name subject courseString teachers members overview school books questions created finished reviews tags mother children knowledgeTree tableOfContent';

        return {
            index: function (req, res) {
                SessionM.find(
                    {},
                    '_id name subject courseString school books questions teachers members overview reviews tags',
                    function (err, sessions) {
                        if (err) {
                            return res.json(400, err);
                        }
                        return res.json(200, sessions);
                    }
                );
            },
            search: function (req, res) {
                if (!req.query.name) {return res.send(400, 'noSessionName'); }
                var query = res.query;
                SessionM.find(
                    {},
                    keyString,
                    function (err, sessions) {
                        if (err) {
                            return res.json(400, err);
                        }
                        return res.json(200, sessions);
                    }
                );
            },
            findOne: function (req, res) {
                if (!req.params.sessionId) { return res.send(400, 'noSessionId'); }
                SessionM.findById(
                    req.params.sessionId,
                    keyString,
                    function (err, user) {
                        if (err) {
                            return res.send(400, 'sessionNotFound ' + err);
                        }
                        res.send(200, user);
                    }
                );
            },
            add: function (req, res) {
                var data = req.body;
                SessionM.add(
                    data,
                    function (err, session) {
                        if (err) {
                            return res.send(400, 'request error' + err);
                        } else {
                            return res.send(201, session);
                        }
                    }
                );

            },
            updateById: function (req, res) {
                if (!req.params.sessionId) { return res.send(400, 'noSessionId'); }
                var data = req.body;
                delete data._id;
                SessionM.findOneAndUpdate(
                    {_id: req.params.sessionId},
                    data,
                    keyString,
                    function (err, session) {
                        if (err) {
                            return res.send(400, err);
                        }
                        res.send(201, session);
                    }
                );
            },
            getQuestions: function (req, res) {
                if (!req.params.sessionId) {return res.send(400, 'noSessionId'); }
                function done(err, session) {
                    if (err) {return res.send(500, err); }
                    return res.send(200, session);
                }
                QuestionM.find({"sessions": req.params.sessionId}).exec(done);
//                SessionM.getQuestions(req.params.sessionId, done);
            },
            getBooks: function (req, res) {
                if (!req.params.sessionId) {return res.send(400, 'noSessionId'); }
                function done(err, session) {
                    if (err) {return res.send(500, err); }
                    return res.send(200, session);
                }
                SessionM.getBooks(req.params.sessionId, done);
            },
            /**
             * upadate question field of session.
             * @param req : { add/pull: { id: <ObjectId> } }
             * @param res
             * @returns {*}
             * @example req = { add: { id: 34523452345254 } }
             * @example req = { remove: { id: 34523452345254 } }
             */
            updateQuestions: function (req, res) {
                if (!req.params.sessionId) {return res.send(400, 'noSessionId'); }
                var data = req.body;
                var session = { _id: req.params.sessionId };

                function done(err, session) {
                    if (err) {return res.send(500, err); }
                    return res.send(201, session);
                }

                if (data.add) {
                    SessionM.addQuestion(session, data.add._id, done);
                } else if (data.pull) {
                    SessionM.removeQuestion(session, data.pull._id, done);
                } else {
                    return res.send(400, 'badPayloadFormat');
                }
            },
            updateBooks: function (req, res) {
                if (!req.params.sessionId) {return res.send(400, 'noSessionId'); }
                var data = req.body;
                var session = { _id: req.params.sessionId };

                function done(err, session) {
                    if (err) {return res.send(500, err); }
                    return res.send(201, session);
                }

                if (data.add) {
                    SessionM.addBook(session, data.add, done);
                } else if (data.pull) {
                    SessionM.removeBook(session, data.pull, done);
                } else {
                    return res.send(400, 'requestHasNoAddNorPullField');
                }
            },
            remove: function (req, res) {
                if (!req.params.sessionId) { return res.send(400, 'noSessionId'); }
                SessionM.remove(
                    {_id: req.params.sessionId},
                    function (err) {
                        if (err) {
                            return res.send(400, 'userNotFound');
                        }
                        res.send(201);
                    }
                );
            }
        };
    });
