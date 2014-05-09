'use strict';
/**
 * @fileOverview School Model
 * @memberOf School
 * @type {exports}
 */

define(['crypto', 'underscore', 'passport', 'passport-local', 'validator', '../rolesHelper',
        './SchemaModels'],
    function (crypto, _, passport, passportLocal, validator, rolesHelper, SchemaModels) {
        var LocalStrategy = passportLocal.Strategy;
        var userRoles = rolesHelper.userRoles;
        var UserM = SchemaModels.User
            , SchoolM = SchemaModels.School;

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        var SchoolMethods = {
            add: function (data, callback) {
                var school = new SchoolM(data);
                school.save(function (err) {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, school);
                    }
                });
            }
        };
        _.extend(SchoolM, SchoolMethods);
        return SchoolM;
    });


