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
                console.log('this is running. this is running.');
                if (!req.params.id) { return res.send(400); }
                var answer = {
                    id: req.params.id,
                    text: req.body.text,
                    author: req.user.username
//                    dateOfCreation: Date.now()
                }
                QuestionM.findByIdAndUpdate(
                    req.params.id,
                    {$push: {answers: answer}},
                    {select: "answers"},
                    function(err, result){
                        if (err) {return res.send(403, err)};
                        return res.send(201, result);
                    });
            },
            /**
             * @api {post} /api/questions/:id/answers/:answerId Update Answer
             * @apiName UpdateAnswer
             * @apiGroup Questions.Answers
             */
            update: function (req, res) {
                if (!req.params.id || !req.params.answerId) { return res.send(400); }
                QuestionM.findOneAndUpdate(
                    {_id: ObjectId(req.params.id), "answers._id": ObjectId(req.params.answerId) },
                    {$set: {'answers.$.text': req.body.text, "answer.$.dateEdited": Date.now()}},
                    {select: 'answers' },
                    function (err, result) {
                        if (err) {
                            return res.send(500, err);
                        } else {
                            return res.send(201, result);
                        };
                    });
            },
            /**
             * @api {delete} /api/questions/:id Delete Question
             * @apiName DeleteQuestion
             * @apiGroup Questions
             */
            removeById: function (req, res) {
                if (!req.params.id || !req.params.answerId) { return res.send(400); }
                QuestionM.findOneAndUpdate(
                    {_id: ObjectId(req.params.id) },
                    {$pull: {answers: {_id: ObjectId(req.params.answerId)} }},
                    {select: 'answers' },
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
