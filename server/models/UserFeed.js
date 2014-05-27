'use strict';
/**
 * @fileOverview User Model
 * @memberOf User
 * @type {exports}
 */

define(['crypto', 'underscore', 'passport', 'passport-local', 'validator', '../rolesHelper',
        './SchemaModels'],
    function (crypto, _, passport, passportLocal, validator, rolesHelper, SchemaModels) {

        var UserFeedM = SchemaModels.UserFeed;

        var maxCount = 1000;
        var UserFeedMethods = {
            newFeedBucket: function (username, currentPageNumber, callback) {
                var query = {
                    username: username,
                    page: currentPageNumber + 1
                };
                var update = {
                    username: username,
                    page: currentPageNumber + 1,
                    count: 0
                };
                UserFeedM.findOneAndUpdate(
                    query,
                    update,
                    {
                        upsert: true,
                        sort: {page: -1} //To make sure to find the largest one.
                    },
                    callback
                );
            },
            addFeed: function (username, type, data, callback) {
                if (!username) {return callback('userFeedNoUsername'); }
                if (!type) {return callback('noFeedType'); }
                if (!data) {return callback('noFeedData'); }
                var query = {
                    username: username
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
                    UserFeedM.findOneAndUpdate(
                        query,
                        update,
                        {  sort: {page: -1} },//To make sure to find the largest one.
                        callback
                    );
                }

                function checkCount(error, doc) {
                    if (error) {
                        console.log('error in userFeed checkCount call back function', error);
                        return callback(error);
                    }
                    if (!doc) {
                        console.log('creating first feed bucket for user');
                        var currentPageNumber = -1;
                        return UserFeedMethods.newFeedBucket(username, currentPageNumber, repeatAdd);
                    } else if (doc.count >= maxCount) {
                        var currentPageNumber = doc.page;
                        return UserFeedMethods.newFeedBucket(username, currentPageNumber, callback);
                    } else {
                        return callback(null, doc);
                    }
                }

                UserFeedM.findOneAndUpdate(
                    query,
                    update,
                    {
                        sort: {page: -1} //To make sure to find the largest one.
                    },
                    checkCount
                );
            }
        };
        _.extend(UserFeedM, UserFeedMethods);
        return UserFeedM;
    });


