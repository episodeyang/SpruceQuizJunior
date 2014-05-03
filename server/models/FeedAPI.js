'use strict';
/**
 * @fileOverview Feed API module
 * @memberOf User
 * @type {exports}
 */

define(['underscore', '../rolesHelper', 'UserFeed'],
    function (_, rolesHelper, UserFeedM) {
        var userRoles = rolesHelper.userRoles;

        return {
            addQuestion: function(user, comment) {},
            addComment: function(user, comment) {},
            addAnswer: function(user, answer) {},
            addEdit: function(user, comment) {},
            addVote: function(user, vote) {}
        };
    });


