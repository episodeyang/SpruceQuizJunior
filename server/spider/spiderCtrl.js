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
            question : function (req, res) {
                var question;
                console.log('req.params.id')
                console.log(req.params.id)
                QuestionM.findById(req.params.id, 'id title text author tags vote voteup votedown comments answers answerComments dateEdited dateCreated', function(err, results){
                    if (err) {return res.send(403, err)}
                    else {
                        question = results;
                        console.log("results")
                        console.log(results)
                        res.render('spider/question.jade',
                            {
                                layout:'spider/layout.jade',
                                title: 'test this',
                                question: question
                            });
                    };
                })
            },
            questions : function (req, res) {
                var questions = null;
                QuestionM.find({}, function(err, docs){
                    if (err) {
                        console.log(err);
                        return res.send(500, err);
                    } else {
                        questions = docs;
                        res.render('spider/questions.jade',
                            {
                                layout:'spider/layout.jade',
                                title: 'test this',
                                questions: questions
                            });
                    };
                })
            }
        }
    }
);
