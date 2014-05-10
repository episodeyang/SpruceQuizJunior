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
define(['underscore', '../models/SchemaModels', '../rolesHelper', "mongoose"],
    function (_, SchemaModels, rolesHelper, mongoose) {
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
                if (!req.params.id) { return res.send(400); }
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
                    {select: "comments"},
                    function(err, result){
                        if (err) {return res.send(403, err)};
                        return res.send(201, result);
                    });
            },
            /**
             * @api {post} /api/questions/:id/comments/:commentId Update Comment
             * @apiName UpdateComment
             * @apiGroup Questions.Comments
             */
            update: function (req, res) {
                if (!req.params.id || !req.params.commentId) { return res.send(400); }
                if (req.body.voteup == 'true' || req.body.votedown == 'true') {
                    var query = {
                        "_id": ObjectId(req.params.id),
                        "comments._id": ObjectId(req.params.commentId)
                    };
                    function callback (err, result){
                        if (req.body.voteup === 'true') {
                            if (result == null) {return res.send(404, 'cannot find comment')};
                            if (result.comments == []) {return res.send(404, 'there is no comment')};
                            if (_.contains(result.comments[0].voteup, req.user.username)) {
                                var update = {
                                    $pull: {
                                        "comments.$.votedown": req.user.username,
                                        "comments.$.voteup": req.user.username
                                    }
                                };
                            } else {
                                var update = {
                                    $pull: {
                                        "comments.$.votedown": req.user.username
                                    },
                                    $push: {
                                        "comments.$.voteup": req.user.username
                                    }
                                };
                            }
                        }
                        if (req.body.votedown === 'true') {
                            if (_.contains(result.comments[0].votedown, req.user.username)) {
                                var update = {
                                    $pull: {
                                        "comments.$.votedown": req.user.username,
                                        "comments.$.voteup": req.user.username
                                    }
                                };
                            } else {
                                var update = {
                                    $pull: {
                                        "comments.$.voteup": req.user.username
                                    },
                                    $push: {
                                        "comments.$.votedown": req.user.username
                                    }
                                };
                            }
                        }
                        QuestionM.findOneAndUpdate(query, update, {select: 'comments'}, function (err, result, n) {
                            var q = {
                                comments: result.comments,
                            };
                            if (err) { return res.send(500, err); }
                            else {
                                return res.send(201, q );
                            };
                        });
                    }

                    QuestionM.findOne(query).select('comments.$').exec(callback);
                } else {
                    QuestionM.findOneAndUpdate(
                        {_id: ObjectId(req.params.id), "comments._id": ObjectId(req.params.commentId) },
//                    New $currentDate applicable at mongodb v2.6 upcoming release.
//                    {$set: {'comments.$.text': req.body.text}, $currentDate: {"comment.$.dateEdited": true}},
                        {$set: {'comments.$.text': req.body.text, 'comment.$.dateEdited': new Date() }},
                        {select: 'comments' },
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
             * @api {delete} /api/questions/:id Delete Question
             * @apiName DeleteQuestion
             * @apiGroup Questions
             */
            removeById: function (req, res) {
                if (!req.params.id || !req.params.commentId) { return res.send(400); }
                QuestionM.findOneAndUpdate(
                    {_id: ObjectId(req.params.id) },
                    {$pull: {comments: {_id: ObjectId(req.params.commentId)} }},
                    {select: 'comments' },
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
