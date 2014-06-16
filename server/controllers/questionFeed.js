/**
 * @fileOverview User Controller
 * @module User
 * @type {exports}
 * This `QuestionCtrl` module takes care of questionFeed related operations, such as
 *              questionFeed.index(),
 *              questionFeed.add(:id),
 *              questionFeed.findOne(:id, payload)
 *              questionFeed.update(:id, payload)
 *              questionFeed.remove(:id)
 *              etc.,
 *
 *
 */
define(['underscore', '../models/SchemaModels', '../models/QuestionFeed', '../rolesHelper', "mongoose"],
    function (_, SchemaModels, QuestionFeedM, rolesHelper, mongoose) {
//        var QuestionFeedM = SchemaModels.QuestionFeed;
        var userRoles = rolesHelper.userRoles;
        var ObjectId = mongoose.Types.ObjectId;
        var fieldString = "_id questionId page count feeds";

        return {
            /**
             * @api {post} /api/questionFeeds Create Question
             * @apiName CreateQuestionFeed
             * @apiGroup QuestionFeed
             */
            // todo: Not being used. All feed added from back end, not from client.
            add: function (req, res) {
                if (!req.params.questionId) {
                    return res.send(400, 'noQuestionIdInRequest');
                }
                function callback (err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(403, err);
                    } else {
                        return res.send(200, doc);
                    }
                }
                QuestionFeedM.addFeed(req.params.questionId, req.body.type, req.body.data, callback);
            },
            /**
             * @api {get} /api/questions/:questionId/feeds Get A Specific Question
             * @apiName GetQuestionFeed
             * @apiGroup Questions
             */
            getByPage: function (req, res) {
                function callback (err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(403, err);
                    } else {
                        return res.send(200, doc);
                    }
                }
                if (!req.params.id) {
                    return res.send(400, 'noQuestionIdInRequest');
                }
                var query = {
                    questionId: req.params.id
                };
                if (req.params.answerId) {
                    query.answerId = req.params.answerId;
                }
                if (req.params.page) {
                    query.page = req.params.page;
                }
                console.log(query);
                QuestionFeedM.findOne(
                    query,
                    'questionId answerId page count feeds',
                    { sort: {
                        questionId: -1,
                        answerId: -1,
                        page: -1
                    } },
                    callback
                );
            }
        };
    });
