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
            , BookM = SchemaModels.Book;

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        var BookMethods = {
            add: function (data, callback) {
                var book = new BookM(data);
                book.save(function (err) {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, book);
                    }
                });
            }
        };
        _.extend(BookM, BookMethods);
        return BookM;
    });


