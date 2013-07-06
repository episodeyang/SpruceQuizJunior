var _ =           require('underscore')
    //, User =      require('../models/User.js')
    , UserM = require('../models/SchemaModels').User
    , userRoles = require('../../client/js/routingConfig').userRoles;

module.exports = {
    index: function(req, res) {
        var users;
        UserM.find(function (err, results) {
            var users = results;
            _.each(users, function(user) {
                delete user.password;
                delete user.twitter;
                delete user.facebook;
                delete user.google;
                delete user.linkedin;
            });
            res.json(users);
        })
    }
};