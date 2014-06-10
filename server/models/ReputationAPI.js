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
                editAccepted: function (toUser) {
                    return Users.updateReputation(toUser, 2, errorLog, 1000);
                },
                upVote: function (toUser) {
                    return Users.updateReputation(toUser, 5, errorLog);
                },
                removeUpVote: function (toUser) {
                    return Users.updateReputation(toUser, -5, errorLog);
                },
                downVote: function (toUser) {
                    return Users.updateReputation(toUser, -2, errorLog);
                },
                removeDownVote: function (toUser) {
                    return Users.updateReputation(toUser, 2, errorLog);
                }
            },
            answer: {
                accepted: function (toUser) {
                    return Users.updateReputation(toUser, 15, errorLog);
                },
                editAccepted: function (toUser) {
                    return Users.updateReputation(toUser, 2, errorLog, 1000);
                },
                removeAccepted: function (toUser) {
                    return Users.updateReputation(toUser, -15, errorLog);
                },
                bountyGranted: function (fromUser, toUser, bounty) {
                    return Users.updateReputation(fromUser, -bounty, errorLog);
                    return Users.updateReputation(toUser, bounty, errorLog);
                },
                bountyAutoGranted: function (fromUser, toUser, bounty) {
                    return Users.updateReputation(fromUser, -bounty/2, errorLog);
                    return Users.updateReputation(toUser, bounty/2, errorLog);
                },
                upVote: function (toUser) {
                    return Users.updateReputation(toUser, 10, errorLog);
                },
                removeUpVote: function (toUser) {
                    return Users.updateReputation(toUser, -10, errorLog);
                },
                downVote: function (toUser) {
                    return Users.updateReputation(toUser, -2, errorLog);
                },
                removeDownVote: function (toUser) {
                    return Users.updateReputation(toUser, 2, errorLog);
                }
            },
            comment: {
                offensiveFlag: function (toUser) {
                    return Users.updateReputation(toUser, -100, errorLog);
                }
            },
            answerComment: {

            }

        };
    });


