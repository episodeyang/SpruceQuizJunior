'use strict';
/**
 * @fileOverview SessionFeed Model
 * @memberOf SessionFeed
 * @type {exports}
 */

define(['crypto', 'underscore', 'passport', 'passport-local', 'validator', '../rolesHelper',
        './SchemaModels'],
    function (crypto, _, passport, passportLocal, validator, rolesHelper, SchemaModels) {
        var SessionFeedM = SchemaModels.SessionFeed;

        var maxCount = 1000;
        var SessionFeedMethods = {
            newFeedBucket: function (sessionId, currentPageNumber, callback) {
                var query = {
                    sessionId: sessionId,
                    page: currentPageNumber + 1
                };
                var update = {
                    sessionId: sessionId,
                    page: currentPageNumber + 1,
                    count: 0
                };
                SessionFeedM.findOneAndUpdate(
                    query,
                    update,
                    {
                        upsert: true,
                        sort: {page: -1} //To make sure to find the largest one.
                    },
                    callback
                );
            },
            addFeed: function (sessionId, type, data, callback) {
                if (!sessionId) {return callback('addFeedFailedNoSessionId'); }
                if (!type) {return callback('noFeedType'); }
                if (!data) {return callback('noFeedData'); }
                var query = {
                    sessionId: sessionId
                };
                var feed = {
                    actionType: type,
                    time: new Date()
                };
                _.extend(feed, data);
                var update = {
                    $inc: {count: 1},
                    $push: {feeds: feed}
                };

                function repeatAdd (error, doc) {
                    if (error) { return console.log(error); }
                    SessionFeedM.findOneAndUpdate(
                        query,
                        update,
                        {  sort: {page: -1} },//To make sure to find the largest one.
                        callback
                    );
                }

                function checkCount(error, doc) {
                    if (error) {
                        console.log('error in checkCount call back function');
                        console.log(error);
                        return callback(error);
                    }
                    if (!doc) {
                        console.log('creating first feed bucket for user');
                        var currentPageNumber = -1;
                        return SessionFeedMethods.newFeedBucket(sessionId, currentPageNumber, repeatAdd);
                    } else if (doc.count >= maxCount) {
                        var currentPageNumber = doc.page;
                        return SessionFeedMethods.newFeedBucket(sessionId, currentPageNumber, callback);
                    } else {
                        return callback(null, doc);
                    }
                }

                SessionFeedM.findOneAndUpdate(
                    query,
                    update,
                    {
                        sort: {page: -1} //To make sure to find the largest one.
                    },
                    checkCount
                );
            }
        };
        _.extend(SessionFeedM, SessionFeedMethods);
        return SessionFeedM;
    });


