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
            , SessionM = SchemaModels.Session;

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        var SessionMethods = {
            add: function (data, callback) {
                var session = new SessionM(data);
                session.save(function (err) {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, session);
                    }
                });
            },
            // todo: not tested not used
            getSet: function (key, sessionId, callback) {
                if (!sessionId) {
                    return callback('noSessionId');
                }
                SessionM.findById(sessionId).select(key).populate(key).exec(callback);
            },
            getQuestions: function (sessionId, callback) {
                SessionMethods.getSet('questions', sessionId, callback);
            },
            getBooks: function (sessionId, callback) {
                if (!sessionId) {
                    return callback('noSessionId');
                }
                SessionM.findById(sessionId).select('books').exec(callback);
            },
            addOrRemoveFromSet: function (key, addOrRemove, session, payload, callback, noRef) {
                console.log('session');
                console.log(session);
                console.log('payload');
                console.log(payload);
                if (!payload) {
                    return callback('noPayload');
                }
                if (!session._id) {
                    return callback('noSessionId');
                }

                function done(error, doc) {
                    if (error) {
                        return callback(error);
                    }

                    if (noRef) {
                        return callback(error, doc);
                    } else {
                        return doc.populate(key, callback);
                    }
                    return;
                }

                var update;

                if (addOrRemove === "add") {
                    update = {
                        $addToSet: {}
                    };
                    update.$addToSet[key] = payload;
                } else if (addOrRemove === "pull") {
                    update = {
                        $pull: {}
                    };
                    update.$pull[key] = payload;
                }
                var options = {
                    new: true,
                    multi: true
                };
                return SessionM.findByIdAndUpdate(
                    session._id,
                    update,
                    options,
                    done
                );
            },
            addQuestion: function (session, question, callback) {
                return SessionMethods.addOrRemoveFromSet('questions', 'add', session, question, callback);
            },
            removeQuestion: function (session, question, callback) {
                return SessionMethods.addOrRemoveFromSet('questions', 'pull', session, question, callback);
            },
            // Book schema uses book fragment.
            addBook: function (session, book, callback) {
                return SessionMethods.addOrRemoveFromSet('books', 'add', session, book, callback, true);
            },
            removeBook: function (session, book, callback) {
                return SessionMethods.addOrRemoveFromSet('books', 'pull', session, book, callback, true);
            },
            // Member schema uses user fragment.
            addMember: function (session, user, callback) {
                return SessionMethods.addOrRemoveFromSet('members', 'add', session, user, callback, true);
            },
            removeMember: function (session, user, callback) {
                return SessionMethods.addOrRemoveFromSet('members', 'pull', session, user, callback, true);
            },
            // Admin schema uses user fragment.
            addTeacher: function (session, teacher, callback) {
                return SessionMethods.addOrRemoveFromSet('teachers', 'add', session, teacher, callback, true);
            },
            removeTeacher: function (session, teacher, callback) {
                return SessionMethods.addOrRemoveFromSet('teachers', 'pull', session, teacher, callback, true);
            }
        };
        _.extend(SessionM, SessionMethods);
        return SessionM;
    });


