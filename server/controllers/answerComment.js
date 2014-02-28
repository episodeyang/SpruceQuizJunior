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
define(['underscore', '../models/SchemaModels', '../rolesHelper', "mongoose"],
    function (_, SchemaModels, rolesHelper, mongoose) {
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
                var comment = {
                    "answerId": req.params.answerId,
                    "text": req.body.text,
                    "author": req.user.username
                };
                QuestionM.findByIdAndUpdate(
                    req.params.id,
                    {$push: {"answerComments": comment}},
                    {select: "answerComments"},
                    function(err, result){
                        if (err) {return res.send(403, err)};
                        return res.send(201, result);
                    });
            },
            /**
             * @api {post} /api/questions/:id/answers/:answerId/comments/:commentId Update Comment
             * @apiName UpdateComment
             * @apiGroup Questions.Comments
             */
            update: function (req, res) {
                if (!req.params.id || !req.params.answerId || !req.params.commentId ) { return res.send(400); }
                if (req.body.voteup == 'true' || req.body.votedown == 'true') {
                    var query = {
                        "_id": ObjectId(req.params.id),
                        "answerComments._id": ObjectId(req.params.commentId)
                    };
                    function callback (err, result){
                        if (! result || !result.answerComments) { return res.send(404, "the answer comment can not be found");}
                        if (req.body.voteup === 'true') {
                            if (result == null) {return res.send(404, 'cannot find comment')};
                            if (result.answerComments == []) {return res.send(404, 'there is no answer comment')};
                            if (_.contains(result.answerComments[0].voteup, req.user.username)) {
                                var update = {
                                    $pull: {
                                        "answerComments.$.votedown": req.user.username,
                                        "answerComments.$.voteup": req.user.username
                                    }
                                };
                            } else {
                                var update = {
                                    $pull: {
                                        "answerComments.$.votedown": req.user.username
                                    },
                                    $push: {
                                        "answerComments.$.voteup": req.user.username
                                    }
                                };
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
                            } else {
                                var update = {
                                    $pull: {
                                        "answerComments.$.voteup": req.user.username
                                    },
                                    $push: {
                                        "answerComments.$.votedown": req.user.username
                                    }
                                };
                            }
                        }
                        QuestionM.findOneAndUpdate(query, update, {select: 'answerComments'}, function (err, result, n) {
                            var q = {
                                answerComments: result.answerComments
                            };
                            if (err) { return res.send(500, err); }
                            else {
                                return res.send(201, q );
                            };
                        });
                    }

                    QuestionM.findOne(query).select('answerComments.$').exec(callback);
                } else {
                    var query = {
                        "_id": ObjectId(req.params.id),
                        "answerComments._id": ObjectId(req.params.commentId)
                    };
                    QuestionM.findOneAndUpdate(
                        query,
//                    New $currentDate applicable at mongodb v2.6 upcoming release.
//                    {$set: {'answers.$.comments.$.text': req.body.text}, $currentDate: {"answers.$.comment.$.dateEdited": true}},
                        {$set: {"answerComments.$.text": req.body.text}},
                        {select: "answerComments"},
                        function (err, result) {
                            if (err) {
                                return res.send(500, err);
                            } else {
                                return res.send(201, result);
                            };
                        });

                }
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
                QuestionM.findOneAndUpdate(
                    query,
                    {$pull: {answerComments: {_id: ObjectId(req.params.commentId)} } },
                    {select: 'answerComments' },
                    function (err, results) {
                        if (err) {
                            return res.send(500, err);
                        } else {
                            return res.send(201, results);
                        };
                    });
            }
        };
    });
