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
define(['underscore', '../models/SchemaModels', '../rolesHelper'],
    function (_, SchemaModels, rolesHelper) {
        "use strict";
        var UserM = SchemaModels.User;
        var BookM = SchemaModels.Book;
        var userRoles = rolesHelper.userRoles;
        var keyString = 'name title signature DOB email addresses strongSubjects extracurriculars schoolRecord teacherFields stats sessions schools textbooks';
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
            findOne: function (req, res) {
                BookM.findOne(
                    {title: req.params.title},
                    keyString,
                    function (err, user) {
                        if (err) {
                            return res.send(404, 'bookNotFound '+ err);
                        }
                        res.send(200, user);
                    }
                );
            },
            add: function (req, res) {
                book = new BookM
                var data = req.body;
                delete data._id;
                BookM.findOneAndUpdate(
                    {title: req.params.title},
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
            update: function (req, res) {
                var data = req.body;
                delete data._id;
                BookM.findOneAndUpdate(
                    {title: req.params.title},
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
    })
