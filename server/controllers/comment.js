/**
 * @fileOverview Comments Controller
 * @module Questions.Comments
 * @type {exports}
 * This `CommentsCtrl` module takes care of question related operations, such as
 *              comment.add(:QuestionId),
 *              comment.remove(:QuestionId, :CommentId)
 *              comment.update(:QuestionId, :CommentId, text)
 *              etc.,
 *
 *
 */
define(['underscore', '../models/SchemaModels', '../rolesHelper', "mongoose", "../models/FeedAPI"],
    function (_, SchemaModels, rolesHelper, mongoose, FeedAPI) {
        var QuestionM = SchemaModels.Question;
        var userRoles = rolesHelper.userRoles;
        var ObjectId = mongoose.Types.ObjectId;
        return {
            /**
             * @api {post} /api/questions/:id/comments Add A Question
             * @apiName CreateComment
             * @apiGroup Questions.Comments
             */
            add: function (req, res) {
                "use strict";
                if (!req.params.id) {
                    return res.send(400);
                }
                var comment = {
                    id: req.params.id,
                    text: req.body.text,
                    author: {
                        username: req.user.username,
                        name: req.user.name
                    }
                };
                QuestionM.findByIdAndUpdate(
                    req.params.id,
                    {$push: {comments: comment}},
                    {select: "_id title comments sessions books"},
                    function (err, question) {
                        if (err) {
                            return res.send(403, err)
                        }
                        FeedAPI.commentAdd(req.user, question, comment, question.sessions, question.books);
                        return res.send(201, question);
                    });
            },
            /**
             * @api {post} /api/questions/:id/comments/:commentId Update Comment
             * @apiName UpdateComment
             * @apiGroup Questions.Comments
             */
            update: function (req, res) {
                if (!req.params.id || !req.params.commentId) {
                    return res.send(400);
                }
                if (!req.body.text) {
                    return res.send(400, 'noCommentText');
                }
                var comment = {
                    _id: req.params.commentId
                };
                QuestionM.findOneAndUpdate(
                    {_id: ObjectId(req.params.id), "comments._id": ObjectId(req.params.commentId) },
//                    New $currentDate applicable at mongodb v2.6 upcoming release.
//                    {$set: {'comments.$.text': req.body.text}, $currentDate: {"comments.$.dateEdited": true}},
                    {$set: {'comments.$.text': req.body.text, 'comments.$.dateEdited': new Date() }},
                    {select: '_id title comments sessions books' },
                    function (err, question) {
                        if (err) {
                            console.log(err);
                            return res.send(500, err);
                        }
                        console.log(question);
                        if (question.comments[question.comments.length - 1].text) {
                            comment.text = question.comments[question.comments.length - 1].text;
                        }
                        FeedAPI.commentEdit(req.user, question, comment, question.sessions, question.books);
                        return res.send(201, question);
                    });

            },
            updateVote: function (req, res) {
                if (!req.params.id || !req.params.commentId) {
                    return res.send(400);
                }
                if (req.body.voteup !== 'true' && req.body.votedown !== 'true') {
                    return res.send(400, 'voteUpAndDownFalse');
                }
                var query = {
                    "_id": ObjectId(req.params.id),
                    "comments._id": ObjectId(req.params.commentId)
                };
                var comment = {
                    _id: req.params.commentId
                };

                function callback(err, result) {
                    // findOne had cursor of comments.$, so only one comment is loaded.
                    var ind = 0;
                    if (result.comments[ind].text) {
                        comment.text = result.comments[ind].text;
                    }
                    if (req.body.voteup === 'true') {
                        if (result == null) {
                            return res.send(404, 'cannot find comment');
                        }
                        if (result.comments == []) {
                            return res.send(404, 'there is no comment');
                        }
                        var actionType;
                        if (_.contains(result.comments[ind].voteup, req.user.username)) {
                            var update = {
                                $pull: {
                                    "comments.$.votedown": req.user.username,
                                    "comments.$.voteup": req.user.username
                                }
                            };
                            actionType = 'removeVoteUp';
                        } else {
                            var update = {
                                $pull: {
                                    "comments.$.votedown": req.user.username
                                },
                                $addToSet: {
                                    "comments.$.voteup": req.user.username
                                }
                            };
                            actionType = 'voteUp';
                        }
                    }
                    if (req.body.votedown === 'true') {
                        if (_.contains(result.comments[ind].votedown, req.user.username)) {
                            var update = {
                                $pull: {
                                    "comments.$.votedown": req.user.username,
                                    "comments.$.voteup": req.user.username
                                }
                            };
                            actionType = 'removeVoteDown';
                        } else {
                            var update = {
                                $pull: {
                                    "comments.$.voteup": req.user.username
                                },
                                $addToSet: {
                                    "comments.$.votedown": req.user.username
                                }
                            };
                            actionType = 'voteDown';
                        }
                    }
                    QuestionM.findOneAndUpdate(
                        query,
                        update,
                        {select: '_id title comments sessions books'},
                        function (err, question) {
                            var q = {
                                comments: question.comments,
                            };
                            if (err) {
                                return res.send(500, err);
                            }
                            FeedAPI.commentVote(actionType, req.user, question, comment, question.sessions, question.books);
                            return res.send(201, q);
                        });
                }

                QuestionM.findOne(query).select('comments.$').exec(callback);
            },
            /**
             * @api {delete} /api/questions/:id Delete Question
             * @apiName DeleteQuestion
             * @apiGroup Questions
             */
            removeById: function (req, res) {
                if (!req.params.id || !req.params.commentId) {
                    return res.send(400);
                }
                var comment = {
                    _id: req.params.commentId
                };
                if (req.body.text) {
                    comment.text = req.body.text;
                }
//                if (question.comments[question.comments.length - 1].text) {
//                    comment.text = question.comments[question.comments.length - 1].text;
//                }
                QuestionM.findOneAndUpdate(
                    {_id: ObjectId(req.params.id) },
                    {$pull: {comments: {_id: ObjectId(req.params.commentId)} }},
                    {select: '_id title comments sessions books' },
                    function (err, question) {
                        if (err) {
                            return res.send(500, err);
                        }
                        return res.send(201, question);
                        FeedAPI.commentRemove(req.user, question, comment, question.sessions, question.books);
                    });
            }
        };
    });
