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
        var userRoles = rolesHelper.userRoles;
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
                var users;
                UserM.find({$where: "this.role.title == 'student'"}, function (err, results) {
                    users = results;
                    _.each(users, function (user) {
                        delete user.password;
                    });
                    console.log(users);
                    res.json(users);
                })
            },
            /**
             * @api {delete} /user/:id Request User information
             * @apiName DeleteUser
             * @apiGroup User
             *
             * @apiParam {Number} id Users unique ID.
             *
             * @apiSuccess {String} @todo need to complete
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
            removebyId: function (req, res) {
                UserM.remove({ id: req.params.uuid }, function (err) {
                    if (err) {
                        res.send(404, "Remove user failed.");
                    }
                });
            },
        };
    })
