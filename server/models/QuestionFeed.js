'use strict';
/**
 * @fileOverview QuestionFeed Model
 * @memberOf QuestionFeed
 * @type {exports}
 */

define(['crypto', 'underscore', 'passport', 'passport-local', 'validator', '../rolesHelper',
        './SchemaModels'],
    function (crypto, _, passport, passportLocal, validator, rolesHelper, SchemaModels) {
        var QuestionFeedM = SchemaModels.QuestionFeed;

        var maxCount = 1000;
        var QuestionFeedMethods = {
            newFeedBucket: function (questionId, currentPageNumber, callback) {
                var query = {
                    questionId: questionId,
                    page: currentPageNumber + 1
                };
                var update = {
                    questionId: questionId,
                    page: currentPageNumber + 1,
                    count: 0
                };
                QuestionFeedM.findOneAndUpdate(
                    query,
                    update,
                    {
                        upsert: true,
                        sort: {page: -1} //To make sure to find the largest one.
                    },
                    callback
                );
            },
            addFeed: function (questionId, type, data, callback) {
                if (!questionId) {return callback('addFeedFailedNoQuestionId'); }
                if (!type) {return callback('noFeedType'); }
                if (!data) {return callback('noFeedData'); }
                var query = {
                    questionId: questionId
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
                    QuestionFeedM.findOneAndUpdate(
                        query,
                        update,
                        {  sort: {page: -1} },//To make sure to find the largest one.
                        callback
                    );
                }

                function checkCount(error, doc) {
                    if (error) {
                        console.log('error in questionFeed checkCount call back function', error);
                        return callback(error);
                    }
                    if (!doc) {
                        console.log('creating first feed bucket for Question');
                        var currentPageNumber = -1;
                        return QuestionFeedMethods.newFeedBucket(questionId, currentPageNumber, repeatAdd);
                    } else if (doc.count >= maxCount) {
                        var currentPageNumber = doc.page;
                        return QuestionFeedMethods.newFeedBucket(questionId, currentPageNumber, callback);
                    } else {
                        return callback(null, doc);
                    }
                }

                QuestionFeedM.findOneAndUpdate(
                    query,
                    update,
                    {
                        sort: {page: -1} //To make sure to find the largest one.
                    },
                    checkCount
                );
            }
        };
        var snapshotAPI = {
            // todo: snapshotAPI
        };
        _.extend(QuestionFeedM, QuestionFeedMethods, {snapshot: snapshotAPI});
        return QuestionFeedM;
    });


