var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;

var UnitM = require('./SchemaModels').Unit;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempunit = new UnitM({
        unitUUID: "d1",
        unitTitle: "多项式简介",
        comment: "",
        father: [],
        child: ["d3"],
        items: ["m1"]
    });
tempunit.save();

tempunit = new UnitM({
        unitUUID: "d2",
        unitTitle: "二元一次多项式",
        comment: "",
        father: [""],
        child: [""],
        items: ["m2"]
    });
tempunit.save();

tempunit = new UnitM({
    unitUUID: "d3",
    unitTitle: "一元二次多项式",
    comment: "",
    father: [""],
    child: [""],
    items: ["m2"]
});
tempunit.save();

tempunit = new UnitM({
        unitUUID: "d4",
        unitTitle: "一元二次多项式的解法",
        comment: "",
        father: ["d3"],
        child: [],
        items: ["m3"]
    });
tempunit.save();

// End of temporary initilization


// //For testing objects-creation
// var units;
// UnitM.find(function (err, results) {
//     units = results;
//     console.log(units);
// })

