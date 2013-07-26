var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;

var UnitM = require('./SchemaModels').Unit;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempunit = new UnitM({
        unitUUID: "d0001",
        unitName: "DirName",
        comment: "",
        father: [],
        child: [],
        items: []
    });
tempunit.save();


// End of temporary initilization


// //For testing objects-creation
// var units;
// UnitM.find(function (err, results) {
//     units = results;
//     console.log(units);
// })

