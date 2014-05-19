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
            addOrRemoveFromSet: function (key, addOrRemove, session, payload, callback) {
                if (!payload) {
                    return callback('noPayload');
                }

                function done(error, doc) {
                    if (error) {
                        console.log(error);
                        return error;
                    }
                    doc.populate(key, callback);
                }

                var options = { new: true };
                var update;

                if (addOrRemove === "add") {
                    update = {
                        $addToSet: {}
                    };
                    update.$addToSet[key] = payload;
                } else if (addOrRemove === "pull") {
                    update = {
                        $pullAll: {}
                    };
                    update.$pullAll[key] = [payload];
                }
                SessionM.findByIdAndUpdate(
                    session._id,
                    update,
                    options,
                    done
                );
            },
            addQuestion: function (session, question, callback) {
                SessionMethods.addOrRemoveFromSet('questions', 'add', session, question, callback);
            },
            removeQuestion: function (session, question, callback) {
                SessionMethods.addOrRemoveFromSet('questions', 'pull', session, question, callback);
            },
            //Todo: not used not tested, and is NOT going to work.
            // Book schema uses book fragment.
            addBook: function (question, book, callback) {
                SessionMethods.addOrRemoveFromSet('books', 'add', question, book, callback);
            },
            removeBook: function (question, book, callback) {
                SessionMethods.addOrRemoveFromSet('books', 'pull', question, book, callback);
            }
        };
        _.extend(SessionM, SessionMethods);
        return SessionM;
    });


