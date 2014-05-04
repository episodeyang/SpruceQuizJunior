'use strict';
/**
 * @fileOverview Feed API module
 * @memberOf User
 * @type {exports}
 */

define(['underscore', '../rolesHelper', './UserFeed'],
    function (_, rolesHelper, UserFeedM) {
        var userRoles = rolesHelper.userRoles;
        function errorLog(error, doc) {
            if (error) {
                return console.log(error);
            }
            return doc;
        }

        return {
            questionAdd: function(user, question) {
                if (!user || !question) { return }
                var snippet = {
                    id : question._id,
                    title: question.title,
                    text: question.text,
                    tags: question.tags
                };
                UserFeedM.addFeed(user._id, user.username, "questionAdd", snippet, errorLog);
            },
            questionEdit: function(user, question) {
                if (!user || !question) { return }
                var snippet = {
                    id : question._id,
                    title: question.title,
                    text: question.text,
                    tags: question.tags
                };
                console.log("snippet");
                console.log(snippet);
                UserFeedM.addFeed(user._id, user.username, "questionEdit", snippet, errorLog);
            },
            questionGet: function(user, question) {
                if (!user || !question) { return }
                var snippet = {
                    id : question._id,
                    title: question.title
                };
                UserFeedM.addFeed(user._id, user.username, "questionGet", snippet, errorLog);
            },
            questionVote: function(user, question) {
                if (!user || !question) { return }
                var snippet = {
                    id : question._id,
                    title: question.title
                };
                function removeUpVote() {
                    UserFeedM.addFeed(user._id, user.username, "questionVote.removeUpVote", snippet, errorLog);
                }
                function upVote() {
                    UserFeedM.addFeed(user._id, user.username, "questionVote.upVote", snippet, errorLog);
                }
                function removeDownVote() {
                    UserFeedM.addFeed(user._id, user.username, "questionVote.removeDownVote", snippet, errorLog);
                }
                function downVote() {
                    UserFeedM.addFeed(user._id, user.username, "questionVote.downVote", snippet, errorLog);
                }
                return {
                    removeUpVote: removeUpVote,
                    upVote: upVote,
                    removeDownVote: removeDownVote,
                    downVote: downVote
                };
            },
            commentAdd: function(user, comment) {
                if (!user || !comment) { return }
                var snippet = {
                    id : comment._id,
                    title: comment.text
                };
                UserFeedM.addFeed(user._id, user.username, "commentAdd", snippet, errorLog);
            },
            answer: function(user, answer) {},
            edit: function(user, comment) {},
            vote: function(user, vote) {}
        };
    });


