/**
 * @fileOverview User Controller
 * @module User
 * @type {exports}
 */

var _ = require('underscore')
//, User =      require('../models/_User.js')
    , UserM = require('../models/SchemaModels').User
    , userRoles = require('../../client/js/rolesHelper').userRoles;
/**
 * @namespace
 */
module.exports = {
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
    index: function (req, res) {
        var users;
        UserM.find(function (err, results) {
            users = results;
            _.each(users, function (user) {
                delete user.password;
                delete user.twitter;
                delete user.facebook;
                delete user.google;
                delete user.linkedin;
            });
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