'use strict';
/**
 * @fileOverview Feed API module
 * @memberOf User
 * @type {exports}
 */

define(['underscore', '../rolesHelper', './UserFeed', './SessionFeed'],
    function (_, rolesHelper, UserFeedM, SessionFeedM) {
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
                if (question.sessions) {
                    snippet.username = user.username;
                    SessionFeedM.addFeed(question.sessions[0], "questionAdd", snippet, errorLog);
                    delete snippet.username;
                    snippet.sessionId = question.sessions[0];
                }
//                if (question.books) {
                      // might need to iterate through multiple books, because there migh be many.
//                    BookFeedM.addFeed(question.books[0], "questionAdd", snippet, errorLog);
//                }
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
                // console.log("snippet");
                // console.log(snippet);
                UserFeedM.addFeed(user._id, user.username, "questionEdit", snippet, errorLog);
            },
            questionGet: function(user, question) {
                if (!user || !question) { return }
                var snippet = {
                    id : question._id,
                    title: question.title
                };
                console.log(question);
                if (question.sessions) {
                    console.log(question.sessions);
                    snippet.username = user.username;
                    SessionFeedM.addFeed(question.sessions[0], "questionGet", snippet, errorLog);
                    delete snippet.username;
                    snippet.sessionId = question.sessions[0];
                }
                UserFeedM.addFeed(user._id, user.username, "questionGet", snippet, errorLog);
            },
            questionVote: function(user, question) {
                if (!user || !question) { return }
                var snippet = {
                    id : question._id,
                    title: question.title
                };
                function removeUpVote() {
                    if (question.sessions) {
                        snippet.username = user.username;
                        SessionFeedM.addFeed(question.sessions[0], "questionVote.removeUpVote", snippet, errorLog);
                        delete snippet.username;
                        snippet.sessionId = question.sessions[0];
                    }
                    UserFeedM.addFeed(user._id, user.username, "questionVote.removeUpVote", snippet, errorLog);
                }
                function upVote() {
                    if (question.sessions) {
                        snippet.username = user.username;
                        SessionFeedM.addFeed(question.sessions[0], "questionVote.upVote", snippet, errorLog);
                        delete snippet.username;
                        snippet.sessionId = question.sessions[0];
                    }
                    UserFeedM.addFeed(user._id, user.username, "questionVote.upVote", snippet, errorLog);
                }
                function removeDownVote() {
                    if (question.sessions) {
                        snippet.username = user.username;
                        SessionFeedM.addFeed(question.sessions[0], "questionVote.removeDownVote", snippet, errorLog);
                        delete snippet.username;
                        snippet.sessionId = question.sessions[0];
                    }
                    UserFeedM.addFeed(user._id, user.username, "questionVote.removeDownVote", snippet, errorLog);
                }
                function downVote() {
                    if (question.sessions) {
                        snippet.username = user.username;
                        SessionFeedM.addFeed(question.sessions[0], "questionVote.downVote", snippet, errorLog);
                        delete snippet.username;
                        snippet.sessionId = question.sessions[0];
                    }
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


