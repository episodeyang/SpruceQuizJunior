var _ =           require('underscore')
    //, User =      require('../models/User.js')
    , UserM = require('../models/SchemaModels').User
    , userRoles = require('../../client/js/rolesHelper').userRoles;

module.exports = {
    index: function(req, res) {
        var users;
        UserM.find(function (err, results) {
            users = results;
            _.each(users, function(user) {
                delete user.password;
                delete user.twitter;
                delete user.facebook;
                delete user.google;
                delete user.linkedin;
            });
            res.json(users);
        })
    },
    removebyId: function(req, res) {
        UserM.remove({ id: req.params.uuid }, function (err) {
            if(err) {
                res.send(404, "Remove user failed.");
            }
        });
    },
};