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
            question: {
                removeUpVote: function (toUser) {
                    return Users.updateReputation(toUser, -2, errorLog);
                },
                upVote: function (toUser) {
                    return Users.updateReputation(toUser, 2, errorLog);
                },
                removeDownVote: function (toUser) {
                    return Users.updateReputation(toUser, 2, errorLog);
                },
                downVote: function (toUser) {
                    return Users.updateReputation(toUser, -2, errorLog);
                }
            }

        };
    });


