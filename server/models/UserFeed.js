'use strict';
/**
 * @fileOverview User Model
 * @memberOf User
 * @type {exports}
 */

define(['crypto', 'underscore', 'passport', 'passport-local', 'validator', '../rolesHelper',
        './SchemaModels'],
    function (crypto, _, passport, passportLocal, validator, rolesHelper, SchemaModels) {
        var LocalStrategy = passportLocal.Strategy;
        var userRoles = rolesHelper.userRoles;
        var UserM = SchemaModels.User;
        //    , StudentM = SchemaModels.Student
        //    , ParentM = SchemaModels.Parent
        //    , TeacherM = SchemaModels.Teacher
        //    , AdminM = SchemaModels.Admin
        //    , SuperadminM = SchemaModels.Superadmin;
        var check = validator.check;

        var UserFeedM = SchemaModels.UserFeed;

        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        var maxCount = 1000;
        var UserFeedMethods = {
            newFeedBucket: function (userId, username, currentPageNumber, callback) {
                var query = {
                    userId: userId,
                    page: currentPageNumber + 1
                };
                var update = {
                    userId: userId,
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
            addFeed: function (userId, username, type, data, callback) {
                if (!userId) {return callback('noUserId'); }
                if (!type) {return callback('noFeedType'); }
                if (!data) {return callback('noFeedData'); }
                var query = {
                    userId: userId
                };
                var feed = {
                    actionType: type,
                    time: new Date(),
                    data: data
                };
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
                        console.log('error in checkCount call back function');
                        console.log(error);
                        return callback(error);
                    }
                    if (!doc) {
                        console.log('creating first feed bucket for user');
                        var currentPageNumber = -1;
                        return UserFeedMethods.newFeedBucket(userId, username, currentPageNumber, repeatAdd);
                    } else if (doc.count >= maxCount) {
                        var currentPageNumber = doc.page;
                        return UserFeedMethods.newFeedBucket(userId, username, currentPageNumber, callback);
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


