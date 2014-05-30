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
define(['underscore', '../models/SchemaModels', '../rolesHelper', '../models/Book'],
    function (_, SchemaModels, rolesHelper, BookM) {
        "use strict";
        var UserM = SchemaModels.User;
//        var BookM = SchemaModels.Book;
        var userRoles = rolesHelper.userRoles;
        var keyString = 'title authors questions category coverUrl editions related metaData publisher reviews tags parents children knowledgeTree tableOfContent';

        return {
            index: function (req, res) {
                var query = {};
                var options;
                if (req.query.title) {
                    options = {populate: 'questions'};
                    query.title = req.query.title;
                    if (req.query.authorName) {
                        query.authors = {
                            $elemMatch: {
                                name: req.query.authorName
                            }
                        };
                    }
                }

                function callback(err, books) {
                    if (err) {
                        return res.json(404, err);
                    }
                    return res.json(200, books);
                }

                BookM.find(query, keyString, options, callback);
            },
            findOne: function (req, res) {
                var query;
                var options = {populate: 'questions'};
                if (req.params.bookId) {
                    BookM.findById(
                        req.params.bookId,
                        keyString,
                        options,
                        callback
                    );
                } else {
                    return res.send(400, 'needBookId');
                }

                function callback(err, book) {
                    if (err) {
                        return res.send(404, 'bookNotFound ' + err);
                    }
                    res.send(200, book);
                }
            },
            add: function (req, res) {
                var data = req.body;
                delete data._id;
                BookM.add(
                    data,
                    function (err, book) {
                        if (err) {
                            return res.send(404, 'request error' + err);
                        } else {
                            return res.send(201, book);
                        }
                    }
                );

            },
            updateById: function (req, res) {
                var data = req.body;
                BookM.findByIdAndUpdate(
                    req.params.bookId,
                    _.omit(data, ['sessions', 'questions']),
                    keyString,
                    function (err, book) {
                        if (err) {
                            return res.send(404, err);
                        }
                        res.send(201, book);
                    }
                );
            },
            /**
             * upadate questions field of book.
             * @param req
             * @param res
             * @returns {*}
             * @example req = { add: { id: 34523452345254 } }
             * @example req = { remove: { id: 34523452345254 } }
             */
            updateQuestions: function (req, res) {
                if (!req.params.bookId) {return res.send(400, 'noBookId'); }
                var data = req.body;
                var book = { _id: req.params.bookId };

                function done(err, book) {
                    if (err) {return res.send(500, err); }
                    return res.send(201, book);
                }

                if (data.add) {
                    BookM.addQuestion(book, data.add.id, done);
                } else if (data.pull) {
                    BookM.removeQuestion(book, data.pull.id, done);
                } else {
                    return res.send(400, 'badPayloadFormat');
                }
            },
            remove: function (req, res) {
                BookM.remove(
                    {title: req.params.title},
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
