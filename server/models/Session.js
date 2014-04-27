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
            , SessionM = SchemaModels.Session;

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        var SessionMethods = {
            add: function (data, callback) {
                var session = new SessionM(data);
                session.save(function (err) {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, session);
                    }
                });
            }
        };
        _.extend(SessionM, SessionMethods);
        return SessionM;
    });


