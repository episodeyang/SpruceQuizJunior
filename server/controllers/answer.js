/**
 * @fileOverview Answers Controller
 * @module Questions.Answers
 * @type {exports}
 * This `AnswersCtrl` module takes care of question related operations, such as
 *              answer.add(:QuestionId),
 *              answer.remove(:QuestionId, :AnswerId)
 *              question.update(:QuestionId, :AnswerId, text)
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
             * @api {post} /api/questions/:id/answers Add A Question
             * @apiName CreateAnswer
             * @apiGroup Questions.Answers
             */
            add: function (req, res) {
                "use strict";
                if (!req.params.id) {
                    return res.send(400);
                }
                var answer = {
                    text: req.body.text,
                    author: {
                        username: req.user.username,
                        name: req.user.name
                    }
                };
                QuestionM.findByIdAndUpdate(
                    req.params.id,
                    {$push: {answers: answer}},
                    {select: "answers"},
                    function (err, result) {
                        if (err) {
                            return res.send(403, err)
                        }
                        return res.send(201, result);
                    }
                );
            },
            /**
             * @api {post} /api/questions/:id/answers/:answerId Update Answer
             * @apiName UpdateAnswer
             * @apiGroup Questions.Answers
             */
            update: function (req, res) {
                if (!req.params.id || !req.params.answerId) {
                    return res.send(400);
                }
                if (req.body.voteup == 'true' || req.body.votedown == 'true') {
                    var query = {
                        "_id": ObjectId(req.params.id),
                        "answers._id": ObjectId(req.params.answerId)
                    };

                    function callback(err, result) {
                        if (req.body.voteup === 'true') {
                            if (_.contains(result.answers[0].voteup, req.user.username)) {
                                var update = {
                                    $pull: {
                                        "answers.$.votedown": req.user.username,
                                        "answers.$.voteup": req.user.username
                                    }
                                };
                            } else {
                                var update = {
                                    $pull: {
                                        "answers.$.votedown": req.user.username
                                    },
                                    $push: {
                                        "answers.$.voteup": req.user.username
                                    }
                                };
                            }
                        }
                        if (req.body.votedown === 'true') {
                            if (_.contains(result.answers[0].votedown, req.user.username)) {
                                var update = {
                                    $pull: {
                                        "answers.$.votedown": req.user.username,
                                        "answers.$.voteup": req.user.username
                                    }
                                };
                            } else {
                                var update = {
                                    $pull: {
                                        "answers.$.voteup": req.user.username
                                    },
                                    $push: {
                                        "answers.$.votedown": req.user.username
                                    }
                                };
                            }
                        }
                        QuestionM.findOneAndUpdate(query, update, {select: 'answers answerComments'}, function (err, result, n) {
                            var q = {
                                answers: result.answers,
                                nAnswers: result.nAnswers
                            };
                            if (err) {
                                return res.send(500, err);
                            }
                            else {
                                return res.send(201, q);
                            }
                            ;
                        });
                    }

                    QuestionM.findOne(query).select('answers.$').exec(callback);
                } else {

                    var query = {_id: ObjectId(req.params.id), "answers._id": ObjectId(req.params.answerId) };
//                    New $currentDate applicable at mongodb v2.6 upcoming release.
//                    {$set: {'answers.$.text': req.body.text}, $currentDate: {"answer.$.dateEdited": true}},
                    var update = {$set: {'answers.$.text': req.body.text, 'answer.$.dateEdited': new Date() }};
                    var options = {select: 'answers answerComments' };
                    QuestionM.findOneAndUpdate(
                        query,
                        update,
                        options,
                        function (err, result) {
                            if (err) {
                                return res.send(500, err);
                            } else {
                                return res.send(201, result);
                            }
                            ;
                        });

                }
            },
            /**
             * @api {delete} /api/questions/:id Delete Question
             * @apiName DeleteQuestion
             * @apiGroup Questions
             */
            removeById: function (req, res) {
                if (!req.params.id || !req.params.answerId) {
                    return res.send(400);
                }
                var query = {
                    _id: ObjectId(req.params.id)
                };
                QuestionM.findOneAndUpdate(
                    query,
                    {$pull: {
                        answers: {_id: ObjectId(req.params.answerId)},
                        answerComments: {answerId: ObjectId(req.params.answerId)}
                    }},
                    {select: 'answers answerComments' },
                    function (err, results) {
                        if (err) {
                            return res.send(500, err);
                        } else {
                            return res.send(201, results);
                        }
                        ;
                    });
            }
        };
    });
