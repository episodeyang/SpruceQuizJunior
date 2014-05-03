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

        var maxCount = 100;
        var UserFeedMethods = {
            newFeedBucket: function (userId, username, currentPageNumber, callback) {
                var query = {
                    userId: userId,
                    page: currentPageNumber + 1
                };
                var update = {
                    userId: userId,
                    username: username
                }
                UserFeedM.findOneAndUpdate(
                    query,
                    update,
                    {
                        upsert: true,
                        sort: {page: -1}
                    },
                    callback
                );
            },
            addFeed: function (userId, type, data, callback) {
                if (!userId) {return callback('noUserId');}
                if (!type) {return callback('noFeedType');}
                if (!data) {return callback('noFeedData');}
                var query = {
                    userId: userId,
                    page: -1
                };
                var feed = {
                    actionType: type,
                    data: data
                };
                var update = {
                    $inc: {count: 1},
                    $push: {feeds: feed}
                };

                function checkCount(error, doc) {
                    if (error) {
                        return callback(error);
                    }
                    if (doc.count >= maxCount) {
                        var currentPageNumber = doc.page;
                        var username = doc.username;
                        this.newFeedBucket(userId, username, currentPageNumber);
                    } else {
                        callback(null, doc);
                    }
                }

                UserFeedM.findOneAndUpdate(
                    query,
                    update,
                    {  sort: {page: -1}  },
                    checkCount
                );
            }
        };
        _.extend(UserFeedM, UserFeedMethods);
    });


