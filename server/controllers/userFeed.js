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

        return {
            /**
             * @api {post} /api/userFeeds Create Question
             * @apiName CreateQuestion
             * @apiGroup Questions
             */
            add: function (req, res) {
                function callback (err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(403, err);
                    } else {
                        console.log(doc);
                        return res.send(200, doc);
                    }
                }
                UserFeedM.addFeed(req.body.userId, user.username, req.body.type, req.body.data, callback);
            },
            /**
             * @api {get} /api/users/:username/feeds Get A Specific Question
             * @apiName GetUserFeed
             * @apiGroup Questions
             */
            getByPage: function (req, res) {
                function callback (err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(403, err);
                    } else {
                        console.log(doc);
                        return res.send(200, doc);
                    }
                }
                if (!req.params.username) {
                    return res.send(400, 'noUsernameInRequest');
                }
                var query = {
                    username: req.params.username
                };
                if (req.params.page) {
                    query.page = req.params.page;
                }
                UserFeedM.findOne(
                    query,
                    null, // the field selection placeholder
                    { sort: {page: -1}},
                    callback
                );
            }
        };
    });
