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
            newFeedBucket: function (questionId, answerId, currentPageNumber, callback) {
                var query = {
                    questionId: questionId,
                    page: currentPageNumber + 1
                };
                var update = {
                    questionId: questionId,
                    page: currentPageNumber + 1,
                    count: 0
                };
                if (answerId) {
                    query.answerId = answerId;
                    update.answerId = answerId;
                }
                return QuestionFeedM.findOneAndUpdate(
                    query,
                    update,
                    {
                        upsert: true,
                        sort: {
                            page: -1, //To make sure to find the largest one.
                            answerId: -1 //To make sure find answerId:null if no answerId is specified.
                        }
                    },
                    callback
                );
            },
            addFeed: function (questionId, answerId, type, data, callback) {
                if (!questionId) {
                    return callback('addFeedFailedNoQuestionId');
                }
                if (!type) {
                    return callback('noFeedType');
                }
                if (!data) {
                    return callback('noFeedData');
                }
                var query = {
                    questionId: questionId
                };
                if (answerId) {
                    query.answerId = answerId;
                }
                var feed = {
                    actionType: type,
                    time: new Date()
                };
                _.extend(feed, data);
                var update = {
                    $inc: {count: 1},
                    $push: {feeds: feed}
                };

                function repeatAdd(error, doc) {
                    if (error) {
                        return console.log(error);
                    }
                    return QuestionFeedM.findOneAndUpdate(
                        query,
                        update,
                        {  sort: {
                            page: -1, //To make sure to find the largest one.
                            answerId: -1 //To make sure find answerId:null if no answerId is specified.
                        } },
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
                        return QuestionFeedMethods.newFeedBucket(questionId, answerId, currentPageNumber, repeatAdd);
                    } else if (doc.count >= maxCount) {
                        var currentPageNumber = doc.page;
                        return QuestionFeedMethods.newFeedBucket(questionId, answerId, currentPageNumber, callback);
                    } else {
                        return callback(null, doc);
                    }
                }

                return QuestionFeedM.findOneAndUpdate(
                    query,
                    update,
                    {
                        sort: {
                            page: -1, //To make sure to find the largest one.
                            answerId: -1 //To make sure find answerId:null if no answerId is specified.
                        }
                    },
                    checkCount
                );
            }
        };
        var snapshotAPI = {
            // todo: snapshotAPI
            questionAdd: function (user, question, callback) {
                if (!question._id) {
                    console.log('error: noQuestionId');
                }
                var typeString = 'questionAdd';
                var data = {
                    user: _.pick(user, ['username', 'name']),
                    question: _.pick(question, ['title', 'text', 'tags'])
                };
                return QuestionFeedMethods.addFeed(question._id, null, typeString, data, callback);
            },
            questionEdit: function (user, reason, question, callback) {
                if (!question._id) {
                    console.log('error: noQuestionId');
                }
                var typeString = 'questionEdit';
                var data = {
                    user: _.pick(user, ['username', 'name']),
                    reason: reason,
                    question: _.pick(question, ['title', 'text', 'tags'])
                };
                return QuestionFeedMethods.addFeed(question._id, null, typeString, data, callback);
            },
            answerAdd: function (user, question, answer, callback) {
                if (!question._id) {
                    console.log('error: noQuestionId');
                }
                if (!answer._id) {
                    console.log('error: noAnswerId');
                }
                var typeString = 'answerAdd';
                var data = {
                    user: _.pick(user, ['username', 'name']),
                    question: _.pick(question, ['title']),
                    answer: _.pick(answer, 'text')
                };
                return QuestionFeedMethods.addFeed(question._id, answer._id, typeString, data, callback);
            },
            answerEdit: function (user, reason, question, answer, callback) {
                if (!question._id) {
                    console.log('error: noQuestionId');
                }
                if (!answer._id) {
                    console.log('error: noAnswerId');
                }
                var typeString = 'answerEdit';
                var data = {
                    user: _.pick(user, ['username', 'name']),
                    reason: reason,
                    question: _.pick(question, ['title']),
                    answer: _.pick(answer, 'text')
                };
                return QuestionFeedMethods.addFeed(question._id, answer._id, typeString, data, callback);
            }
        };
        _.extend(QuestionFeedM, QuestionFeedMethods, {snapshot: snapshotAPI});
        return QuestionFeedM;
    })
;


