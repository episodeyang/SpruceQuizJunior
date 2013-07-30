var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;

var FeedM = require('./SchemaModels').Feed;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempfeed = new FeedM({
        feedUUID: "f1",
        userUUID: "u1",
        groupUUID: "g1",
        type: "Posted blog",
        feedData: "I am writing a new blog!",
        createdDate: new Date,
        archived: [false]
    });
tempfeed.save();

tempfeed = new FeedM({
        feedUUID: "f2",
        userUUID: "u2",
        groupUUID: "g1",
        type: "Added photo",
        feedData: "I am adding a photo!",
        createdDate: new Date,
        archived: [false]
    });
tempfeed.save();

tempfeed = new FeedM({
        feedUUID: "f3",
        userUUID: "u1",
        groupUUID: "g2",
        type: "Commented",
        feedData: "I am commenting!",
        createdDate: new Date,
        archived: [false]
    });
tempfeed.save();

tempfeed = new FeedM({
        feedUUID: "f4",
        userUUID: "u1",
        groupUUID: "g1",
        type: "Commented",
        feedData: "I am commenting again!",
        createdDate: new Date,
        archived: [true]
    });
tempfeed.save();

// End of temporary initilization


// //For testing objects-creation
// var feeds;
// FeedM.find(function (err, results) {
//     feeds = results;
//     console.log(feeds);
// })

