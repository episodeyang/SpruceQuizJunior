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
define(['underscore', '../models/SchemaModels', '../rolesHelper', '../models/Session.js'],
    function (_, SchemaModels, rolesHelper, SessionM) {
        "use strict";
        var UserM = SchemaModels.User;
        var userRoles = rolesHelper.userRoles;
        var keyString = '_id title teachers members overview schools created finished reviews tags mother children knowledgeTree tableOfContent';

        return {
            index: function (req, res) {
                SessionM.find(
                    {},
                    keyString,
                    function (err, sessions) {
                        if (err) {
                            return res.json(404, err);
                        }
                        return res.json(200, sessions);
                    }
                );
            },
            findOne: function (req, res) {
                SessionM.findById(
                    req.params.sessionId,
                    keyString,
                    function (err, user) {
                        if (err) {
                            return res.send(404, 'sessionNotFound ' + err);
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
                            return res.send(404, 'request error' + err);
                        } else {
                            return res.send(201, session);
                        }
                    }
                );

            },
            updateById: function (req, res) {
                var data = req.body;
                delete data._id;
                SessionM.findOneAndUpdate(
                    {_id: req.params.sessionId},
                    data,
                    keyString,
                    function (err, session) {
                        if (err) {
                            return res.send(404, err);
                        }
                        res.send(201, session);
                    }
                );
            },
            remove: function (req, res) {
                SessionM.remove(
                    {_id: req.params.sessionId},
                    function (err) {
                        if (err) {
                            return res.send(404, 'userNotFound');
                        }
                        res.send(201);
                    }
                );
            }
        };
    });
