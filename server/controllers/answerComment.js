/**
 * @fileOverview Answers Comments Controller
 * @module Questions.Answers.Comments
 * @type {exports}
 * This `CommentsCtrl` module takes care of question related operations, such as
 *              comment.add(:QuestionId, :AnswerId),
 *              comment.remove(:QuestionId, :AnswerId, :CommentId)
 *              comment.update(:QuestionId, :AnswerId, :CommentId, text)
 *              etc.,
 *
 *
 */
define(['underscore', '../models/SchemaModels', '../rolesHelper', "mongoose", '../models/FeedAPI'],
    function (_, SchemaModels, rolesHelper, mongoose, FeedAPI) {
        var QuestionM = SchemaModels.Question;
        var userRoles = rolesHelper.userRoles;
        var ObjectId = mongoose.Types.ObjectId;
        return {
            /**
             * @api {post} /api/questions/:id/answer/:answerId/comments Add A Comment to an answer
             * @apiName CreateComment
             * @apiGroup Questions.Comments
             */
            add: function (req, res) {
                "use strict";
                if (!req.params.id || !req.params.answerId) { return res.send(400); }
                var answer = { "_id": req.params.answerId};
                var comment = {
                    "answerId": req.params.answerId,
                    "text": req.body.text,
                    "author": {
                        username: req.user.username,
                        name: req.user.name
                    }
                };
                QuestionM.findByIdAndUpdate(
                    req.params.id,
                    {$push: {"answerComments": comment}},
                    {select: "answerComments"},
                    function(err, question){
                        if (err) {return res.send(403, err)}
                        FeedAPI.answerCommentAdd(req.user, question, answer, comment, question.sessions, question.books);
                        return res.send(201, question);
                    });
            },
            /**
             * @api {post} /api/questions/:id/answers/:answerId/comments/:commentId Update Comment
             * @apiName UpdateComment
             * @apiGroup Questions.Comments
             */
            update: function (req, res) {
                if (!req.params.id || !req.params.answerId || !req.params.commentId ) { return res.send(400); }
                if (!req.body.text) { return res.send(400, 'noTextInUpdate'); }
                var query = {
                    "_id": ObjectId(req.params.id),
                    "answerComments._id": ObjectId(req.params.commentId)
                };
                var answer = { "_id": req.params.answerId};
                var comment = {
                    "_id": req.params._id,
                    text : req.body.text
                };
                QuestionM.findOneAndUpdate(
                    query,
//                    New $currentDate applicable at mongodb v2.6 upcoming release.
//                    {$set: {'answers.$.comments.$.text': req.body.text}, $currentDate: {"answers.$.comment.$.dateEdited": true}},
                    {$set: {"answerComments.$.text": req.body.text}},
                    {select: "answerComments"},
                    function (err, question) {
                        if (err) {
                            return res.send(500, err);
                        }
                        FeedAPI.answerCommentEdit(req.user, question, answer, comment, question.sessions, question.books);
                        return res.send(201, question);
                    });

            },
            updateVote: function (req, res) {
                if (!req.params.id || !req.params.answerId || !req.params.commentId ) { return res.send(400); }
                if (req.body.voteup !== 'true' && req.body.votedown !== 'true') {
                    return res.send(400, 'voteupAndVotedownNotTrue');
                }
                var query = {
                    "_id": ObjectId(req.params.id),
                    "answerComments._id": ObjectId(req.params.commentId)
                };
                var answer = { "_id": req.params.answerId};
                var comment = {
                    "_id": req.params.commentId
                };
                if (req.body.text) { comment.text = req.body.text; }
                function callback (err, result){
                    if (! result || !result.answerComments) { return res.send(404, "the answer comment can not be found");}
                    if (req.body.voteup === 'true') {
                        if (result == null) {return res.send(404, 'cannot find comment')};
                        if (result.answerComments == []) {return res.send(404, 'there is no answer comment')};
                        var actionType;
                        if (_.contains(result.answerComments[0].voteup, req.user.username)) {
                            var update = {
                                $pull: {
                                    "answerComments.$.votedown": req.user.username,
                                    "answerComments.$.voteup": req.user.username
                                }
                            };
                            actionType = 'removeUpVote';
                        } else {
                            var update = {
                                $pull: {
                                    "answerComments.$.votedown": req.user.username
                                },
                                $push: {
                                    "answerComments.$.voteup": req.user.username
                                }
                            };
                            actionType = 'upVote';
                        }
                    }
                    if (req.body.votedown === 'true') {
                        if (_.contains(result.answerComments[0].votedown, req.user.username)) {
                            var update = {
                                $pull: {
                                    "answerComments.$.votedown": req.user.username,
                                    "answerComments.$.voteup": req.user.username
                                }
                            };
                            actionType = 'removeDownVote';
                        } else {
                            var update = {
                                $pull: {
                                    "answerComments.$.voteup": req.user.username
                                },
                                $push: {
                                    "answerComments.$.votedown": req.user.username
                                }
                            };
                            actionType = 'downVote';
                        }
                    }
                    QuestionM.findOneAndUpdate(query, update, {select: 'answerComments'}, function (err, question) {
                        var q = {
                            answerComments: question.answerComments
                        };
                        if (err) { return res.send(500, err); }
                        FeedAPI.answerCommentVote(actionType, req.user, answer, question, comment, question.sessions, question.books);
                        return res.send(201, q );
                    });
                }

                QuestionM.findOne(query).select('answerComments.$').exec(callback);
            },
            /**
             * @api {delete} /api/questions/:id/answers/:answerId/comments/:commentId Delete Question
             * @apiName DeleteQuestion
             * @apiGroup Questions
             */
            removeById: function (req, res) {
                if (!req.params.id || !req.params.answerId || !req.params.commentId ) { return res.send(400); }
                var query = {
                    "_id": ObjectId(req.params.id),
                    "answerComments._id": ObjectId(req.params.commentId),
                };
                var answer = { "_id": req.params.answerId};
                var comment = {
                    "_id": req.params.commentId
                };
                QuestionM.findOneAndUpdate(
                    query,
                    {$pull: {answerComments: {_id: ObjectId(req.params.commentId)} } },
                    {select: 'answerComments' },
                    function (err, question) {
                        if (err) {
                            return res.send(500, err);
                        }
                        FeedAPI.answerCommentRemove(req.user, answer, question, comment, question.sessions, question.books);
                        return res.send(201, question);
                    });
            }
        };
    });
