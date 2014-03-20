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
            question : function (req, res) {},
            questions : function (req, res) {
                "use strict";
                res.send({
                    test:"json data is here"
                })
            }
        }
    }
);
