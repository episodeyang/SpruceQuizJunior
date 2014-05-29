/**
 * @fileOverview User Controller
 * @module User
 * @type {exports}
 * This `QuestionCtrl` module takes care of sessionFeed related operations, such as
 *              sessionFeed.index(),
 *              sessionFeed.add(:id),
 *              sessionFeed.findOne(:id, payload)
 *              sessionFeed.update(:id, payload)
 *              sessionFeed.remove(:id)
 *              etc.,
 *
 *
 */
define(['underscore', '../models/SchemaModels', '../models/SessionFeed', '../rolesHelper', "mongoose"],
    function (_, SchemaModels, SessionFeedM, rolesHelper, mongoose) {
//        var SessionFeedM = SchemaModels.SessionFeed;
        var userRoles = rolesHelper.userRoles;
        var ObjectId = mongoose.Types.ObjectId;
        var fieldString = "_id sessionId page count feeds";

        return {
            /**
             * @api {post} /api/sessionFeeds Create Question
             * @apiName CreateSessionFeed
             * @apiGroup SessionFeed
             */
            // todo: Not being used. All feed added from back end, not from client.
            add: function (req, res) {
                if (!req.params.sessionId) {
                    return res.send(400, 'noSessionIdInRequest');
                }
                function callback (err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(403, err);
                    } else {
                        return res.send(200, doc);
                    }
                }
                SessionFeedM.addFeed(req.params.sessionId, req.body.type, req.body.data, callback);
            },
            /**
             * @api {get} /api/sessions/:sessionId/feeds Get A Specific Question
             * @apiName GetSessionFeed
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
                if (!req.params.sessionId) {
                    return res.send(400, 'noSessionIdInRequest');
                }
                var query = {
                    sessionId: req.params.sessionId
                };
                if (req.params.page) {
                    query.page = req.params.page;
                }
                SessionFeedM.findOne(
                    query,
                    null, // the field selection placeholder
                    { sort: {page: -1}},
                    callback
                );
            }
        };
    });
