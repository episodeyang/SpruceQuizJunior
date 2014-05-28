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
define(['underscore', '../models/SchemaModels', '../models/BookFeed', '../rolesHelper', "mongoose"],
    function (_, SchemaModels, BookFeedM, rolesHelper, mongoose) {
//        var BookFeedM = SchemaModels.BookFeed;
        var userRoles = rolesHelper.userRoles;
        var ObjectId = mongoose.Types.ObjectId;
        var fieldString = "_id bookId page count feeds";

        return {
            /**
             * @api {post} /api/sessionFeeds Create Question
             * @apiName CreateBookFeed
             * @apiGroup BookFeed
             */
            // todo: Not being used. All feed added from back end, not from client.
            add: function (req, res) {
                if (!req.params.bookId) {
                    return res.send(400, 'noBookIdInRequest');
                }
                function callback (err, doc) {
                    if (err) {
                        console.log(err);
                        return res.send(403, err);
                    } else {
                        return res.send(200, doc);
                    }
                }
                BookFeedM.addFeed(req.params.bookId, req.body.type, req.body.data, callback);
            },
            /**
             * @api {get} /api/sessions/:bookId/feeds Get A Specific Question
             * @apiName GetBookFeed
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
                if (!req.params.bookId) {
                    return res.send(400, 'noBookIdInRequest');
                }
                var query = {
                    bookId: req.params.bookId
                };
                if (req.params.page) {
                    query.page = req.params.page;
                }
                BookFeedM.findOne(
                    query,
                    null, // the field selection placeholder
                    { sort: {page: -1}},
                    callback
                );
            }
        };
    });
