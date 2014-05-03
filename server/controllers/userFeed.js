/**
 * @fileOverview User Controller
 * @module User
 * @type {exports}
 * This `QuestionCtrl` module takes care of userFeed related operations, such as
 *              userFeed.index(),
 *              userFeed.add(:id),
 *              userFeed.findOne(:id, payload)
 *              userFeed.update(:id, payload)
 *              userFeed.remove(:id)
 *              etc.,
 *
 *
 */
define(['underscore', '../models/SchemaModels', '../models/UserFeed', '../rolesHelper', "mongoose"],
    function (_, SchemaModels, UserFeedM, rolesHelper, mongoose) {
//        var UserFeedM = SchemaModels.UserFeed;
        var userRoles = rolesHelper.userRoles;
        var ObjectId = mongoose.Types.ObjectId;
        var fieldString = "_id userId username page count feeds";

        function callback (err, doc) {
            if (err) {
                console.log(err);
                return res.send(403, err);
            } else {
                return res.send(200, results);
            }
        }
        return {
            /**
             * @api {post} /api/userFeeds Create Question
             * @apiName CreateQuestion
             * @apiGroup Questions
             */
            add: function (req, res) {
                UserFeedM.addFeed(req.body.userId, req.body.type, req.body.data, callback);
            },
            /**
             * @api {get} /api/userFeeds/:id Get A Specific Question
             * @apiName GetQuestion
             * @apiGroup Questions
             */
            getByPage: function (req, res) {
                if (!req.params.userId) {
                    return res.send(400, 'noUserIdInRequest');
                }
                var query = {
                    userId: req.params.userId
                };
                if (!req.params.page) {
                     query.page = -1;
                } else {
                    query.page = req.params.page;
                }
                UserFeedM.findOne(query, callback);
            }
        };
    });
