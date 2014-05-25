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
            , BookM = SchemaModels.Book;

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        var BookMethods = {
            add: function (data, callback) {
                var book = new BookM(data);
                book.save(function (err) {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, book);
                    }
                });
            },
            //todo: not tested not used
            getSet: function (key, bookId, callback) {
                if (!bookId) {
                    return callback('noBookId');
                }
                BookM.findById(bookId).select(key).populate(key).exec(callback);
            },
            addOrRemoveFromSet: function (key, addOrRemove, book, payload, callback, noRef) {
                if (!payload) {
                    return callback('noPayload');
                }

                function done(error, doc) {
                    if (error) {
                        console.log(error);
                        return error;
                    }
                    if (noRef) {
                        callback(error, doc);
                    } else {
                        doc.populate(key, callback);
                    }
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
                BookM.findByIdAndUpdate(
                    book._id,
                    update,
                    options,
                    done
                );
            },
            addQuestion: function (book, question, callback) {
                BookMethods.addOrRemoveFromSet('questions', 'add', book, question, callback);
            },
            removeQuestion: function (book, question, callback) {
                BookMethods.addOrRemoveFromSet('questions', 'pull', book, question, callback);
            },
            addAdmin: function (book, user, callback) {
                BookMethods.addOrRemoveFromSet('admins', 'add', book, user, callback, true);
            },
            removeAdmin: function (book, user, callback) {
                BookMethods.addOrRemoveFromSet('admins', 'pull', book, user, callback, true);
            },
            addMember: function (book, user, callback) {
                BookMethods.addOrRemoveFromSet('members', 'add', book, user, callback, true);
            },
            removeMember: function (book, user, callback) {
                BookMethods.addOrRemoveFromSet('members', 'pull', book, user, callback, true);
            }
        };
        _.extend(BookM, BookMethods);
        return BookM;
    });


