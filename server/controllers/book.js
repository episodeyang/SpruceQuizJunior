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
        var keyString = 'title authors category coverUrl editions related metaData publisher reviews tags parents children knowledgeTree tableOfContent';

        return {
            index: function (req, res) {
                var query = {};

                if (req.query.title) {
                    console.log('see query.title');
                    console.log(req.query.title);
                    console.log(req.query);
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

                BookM.find(query, keyString, callback);
            },
            findOne: function (req, res) {
                var query;
                if (req.params.bookId) {
                    BookM.findById(
                        req.params.bookId,
                        keyString,
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
                delete data._id;
                BookM.findOneAndUpdate(
                    {_id: req.params.id},
                    data,
                    keyString,
                    function (err, book) {
                        if (err) {
                            return res.send(404, err);
                        }
                        res.send(201, book);
                    }
                );
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
