'use strict';
/**
 * @fileOverview Book Model
 * @memberOf Book
 * @type {exports}
 */

define(['crypto', 'underscore', 'passport', 'passport-local', 'validator', '../rolesHelper',
        './SchemaModels'],
    function (crypto, _, passport, passportLocal, validator, rolesHelper, SchemaModels) {

        var BookFeedM = SchemaModels.BookFeed;

        var maxCount = 1000;
        var BookFeedMethods = {
            newFeedBucket: function (bookId, currentPageNumber, callback) {
                var query = {
                    bookId: bookId,
                    page: currentPageNumber + 1
                };
                var update = {
                    bookId: bookId,
                    page: currentPageNumber + 1,
                    count: 0
                };
                BookFeedM.findOneAndUpdate(
                    query,
                    update,
                    {
                        upsert: true,
                        sort: {page: -1} //To make sure to find the largest one.
                    },
                    callback
                );
            },
            addFeed: function (bookId, bookname, type, data, callback) {
                if (!bookId) {return callback('noBookId'); }
                if (!type) {return callback('noFeedType'); }
                if (!data) {return callback('noFeedData'); }
                var query = {
                    bookId: bookId
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
                    BookFeedM.findOneAndUpdate(
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
                        console.log('creating first feed bucket for book');
                        var currentPageNumber = -1;
                        return BookFeedMethods.newFeedBucket(bookId, bookname, currentPageNumber, repeatAdd);
                    } else if (doc.count >= maxCount) {
                        var currentPageNumber = doc.page;
                        return BookFeedMethods.newFeedBucket(bookId, bookname, currentPageNumber, callback);
                    } else {
                        return callback(null, doc);
                    }
                }

                BookFeedM.findOneAndUpdate(
                    query,
                    update,
                    {
                        sort: {page: -1} //To make sure to find the largest one.
                    },
                    checkCount
                );
            }
        };
        _.extend(BookFeedM, BookFeedMethods);
        return BookFeedM;
    });


