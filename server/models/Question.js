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
        var QuestionM = SchemaModels.Question;

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        var QuestionMethods = {
            // todo: not tested not used
            getSet: function (key, question, callback) {
                if (!question._id) {
                    return callback('noQuestionId');
                }
                QuestionM.findById(question._id).select(key).populate(key).exec(callback);
            },
            addOrRemoveFromSet: function (key, addOrRemove, question, payload, callback) {
                if (!payload._id) {
                    return callback('noPayload._id');
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
                    update.$addToSet[key] = payload._id;
                } else if (addOrRemove === "pull") {
                    update = {
                        $pullAll: {}
                    };
                    update.$pullAll[key] = [payload._id];
                }
                QuestionM.findByIdAndUpdate(
                    question._id,
                    update,
                    options,
                    done
                );
            },
            addSession: function (question, session, callback) {
                QuestionMethods.addOrRemoveFromSet('questions', 'add', question, session, callback);
            },
            removeQuestion: function (question, session, callback) {
                QuestionMethods.addOrRemoveFromSet('questions', 'pull', question, session, callback);
            },
            //Todo: not used not tested
            addBook: function (question, book, callback) {
                QuestionMethods.addOrRemoveFromSet('books', 'add', question, book, callback);
            },
            removeBook: function (question, book, callback) {
                QuestionMethods.addOrRemoveFromSet('books', 'pull', question, book, callback);
            }
        };
        return _.extend(QuestionM, QuestionMethods);
    });


