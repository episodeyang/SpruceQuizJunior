'use strict';
/**
 * @fileOverview Reputation API module
 * @memberOf Reputation
 * @type {exports}
 */

define(['underscore', '../rolesHelper', 'async', './User'],
    function (_, rolesHelper, async, Users) {
        var userRoles = rolesHelper.userRoles;

        function errorLog(error, doc) {
            if (error) {
                return console.log(error);
            }
            return doc;
        }

        /**
         *
         */
        return {
            upvote: function (toUser) {
                Users.updateReputation(toUser, 2);
            }

        };
    });


