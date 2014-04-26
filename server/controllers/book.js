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
                BookM.find(
                    {},
                    keyString,
                    function (err, books) {
                        if (err) {
                            return res.json(404, err);
                        }
                        return res.json(200, books);
                    }
                );
            },
            findOneByTitle: function (req, res) {
                BookM.findOne(
                    {
                        title: req.params.title
                    },
                    keyString,
                    function (err, user) {
                        if (err) {
                            return res.send(404, 'bookNotFound ' + err);
                        }
                        res.send(200, user);
                    }
                );
            },
            findOneByAuthorAndTitle: function (req, res) {
                BookM.findOne(
                    {
                        title: req.params.title,
                        authors: {
                            $elemMatch: {
                                name: req.params.author
                            }
                        }
                    },
                    keyString,
                    function (err, book) {
                        if (err) {
                            return res.send(404, 'bookNotFound ' + err);
                        } else {
                            return res.send(200, book);
                        }
                    }
                )
                ;
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
        }
            ;
    })
