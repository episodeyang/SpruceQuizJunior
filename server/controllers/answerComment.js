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
                        "answerComments._id": ObjectId(req.params.answerId)
//                        "answers.comments._id": ObjectId(req.params.commentId)
                    };
                    function callback (err, result){
                        if (req.body.voteup === 'true') {
                            if (_.contains(result.comments[0].voteup, req.user.username)) {
                                var update = {
                                    $pull: {
                                        "answers.$.comments.$.votedown": req.user.username,
                                        "answers.$.comments.$.voteup": req.user.username
                                    }
                                };
                            } else {
                                var update = {
                                    $pull: {
                                        "answers.$.comments.$.votedown": req.user.username
                                    },
                                    $push: {
                                        "answers.$.comments.$.voteup": req.user.username
                                    }
                                };
                            }
                        }
                        if (req.body.votedown === 'true') {
                            if (_.contains(result.comments[0].votedown, req.user.username)) {
                                var update = {
                                    $pull: {
                                        "answers.$.comments.$.votedown": req.user.username,
                                        "answers.$.comments.$.voteup": req.user.username
                                    }
                                };
                            } else {
                                var update = {
                                    $pull: {
                                        "answers.$.comments.$.voteup": req.user.username
                                    },
                                    $push: {
                                        "answers.$.comments.$.votedown": req.user.username
                                    }
                                };
                            }
                        }
                        QuestionM.findOneAndUpdate(query, update, {select: 'answers.comments'}, function (err, result, n) {
                            var q = {
                                comments: result.comments,
                            };
                            if (err) { return res.send(500, err); }
                            else {
                                return res.send(201, q );
                            };
                        });
                    }

                    QuestionM.findOne(query).select('answers').exec(callback);
                } else {
                    var query = {
                        "_id": ObjectId(req.params.id),
//                        "answerComments.answersId": ObjectId(req.params.answerId),
                        "answerComments._id": ObjectId(req.params.commentId)
                    };
                    console.log(query);
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
                    "answers._id": ObjectId(req.params.answerId),
                };
                QuestionM.findOneAndUpdate(
                    query,
                    {$pull: {answers: {comments: {_id: ObjectId(req.params.commentId)} } }},
                    {select: 'answers.comments' },
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
