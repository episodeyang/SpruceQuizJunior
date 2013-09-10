var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;

var FeedM = require('./../SchemaModels').Feed;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempfeed = new FeedM({
        feedUUID: "f1",
        userUUID: "u1",
        groupUUID: "g1",
        type: "Posted blog",
        feedData: "写了一篇新的博客文章",
        createdDate: new Date,
        archived: [false]
    });
tempfeed.save();

tempfeed = new FeedM({
        feedUUID: "f2",
        userUUID: "u2",
        groupUUID: "g1",
        type: "Record",
        feedData: "突破了新的速度记录",
        createdDate: new Date,
        archived: [false]
    });
tempfeed.save();

tempfeed = new FeedM({
        feedUUID: "f3",
        userUUID: "u1",
        groupUUID: "g2",
        type: "Comment",
        feedData: "留言：这篇文章写的真好啊！收藏了！",
        createdDate: new Date,
        archived: [false]
    });
tempfeed.save();

tempfeed = new FeedM({
        feedUUID: "f4",
        userUUID: "u3",
        groupUUID: "g1",
        type: "Share",
        feedData: "分享了维基百科页面：宇宙大爆炸",
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

