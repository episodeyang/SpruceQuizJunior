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
define(['underscore', '../models/SchemaModels', '../rolesHelper', "mongoose", '../models/FeedAPI'],
    function (_, SchemaModels, rolesHelper, mongoose, FeedAPI) {
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
                    {select: "_id title sessions books answers"},
                    function (err, question) {
                        if (err) {
                            return res.send(403, err);
                        }
                        FeedAPI.answerAdd(req.user, question, answer, question.sessions, question.books);
                        return res.send(201, question);
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

                var query = {_id: ObjectId(req.params.id), "answers._id": ObjectId(req.params.answerId) };
                // it looks like the $currentDate is not working.
//                    {$set: {'answers.$.text': req.body.text}, $currentDate: {"answers.$.dateEdited": true}},
                var update = {
                    $set: {
                        'answers.$.text': req.body.text,
                        'answers.$.dateEdited': new Date()
                    }
                };
                var options = {select: '_id title answers answerComments sessions books' };
                QuestionM.findOneAndUpdate(
                    query,
                    update,
                    options,
                    function (err, question) {
                        if (err) {
                            console.log(err);
                            return res.send(500, err);
                        }
                        FeedAPI.answerUpdate(req.user, question, {text: req.body.text}, question.sessions, question.books);
                        return res.send(201, question);
                    });
            },
            updateVote: function (req, res) {
                if (!req.params.id || !req.params.answerId) {
                    return res.send(400);
                }
                if (!req.body.voteup && !req.body.votedown) {
                    return res.send(400, 'noVoteUpNorDown');
                }
                var query = {
                    "_id": ObjectId(req.params.id),
                    "answers._id": ObjectId(req.params.answerId)
                };

                function callback(err, result) {
                    var actionType;
                    if (req.body.voteup === 'true') {
                        if (_.contains(result.answers[0].voteup, req.user.username)) {
                            var update = {
                                $pull: {
                                    "answers.$.votedown": req.user.username,
                                    "answers.$.voteup": req.user.username
                                }
                            };
                            actionType = 'removeVoteUp';
                        } else {
                            var update = {
                                $pull: {
                                    "answers.$.votedown": req.user.username
                                },
                                $push: {
                                    "answers.$.voteup": req.user.username
                                }
                            };
                            actionType = 'voteUp';
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
                            actionType = 'removeVoteDown';
                        } else {
                            var update = {
                                $pull: {
                                    "answers.$.voteup": req.user.username
                                },
                                $push: {
                                    "answers.$.votedown": req.user.username
                                }
                            };
                            actionType = 'voteDown';
                        }
                    }
                    QuestionM.findOneAndUpdate(
                        query,
                        update,
                        {select: '_id title answers answerComments'},
                        function (err, question, n) {
                            var q = {
                                answers: question.answers,
                                nAnswers: question.nAnswers
                            };
                            if (err) {
                                return res.send(500, err);
                            }
                            FeedAPI.answerVote(actionType, req.user, question, {text: req.body.text}, question.sessions, question.books);
                            return res.send(201, q);
                        });
                }

                QuestionM.findOne(query).select('answers.$').exec(callback);
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
                    {select: '_id title answers answerComments' },
                    function (err, question) {
                        if (err) {
                            return res.send(500, err);
                        }
                        FeedAPI.answerRemove(req.user, question, {text: req.body.text}, question.sessions, question.books);
                        return res.send(201, question);
                    });
            }
        };
    });
