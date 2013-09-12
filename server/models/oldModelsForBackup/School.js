var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;
    //, userRoles =       require('../../client/js/routingConfig').userRoles;

var SchoolM = require('./../SchemaModels').School;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempschool = new SchoolM({
        schoolUUID: "s1",
        schoolName: "No.1 High School",
        sections: ["g1", "g2", "g3"]
    });
tempschool.save();

tempschool = new SchoolM({
        schoolUUID: "s2",
        schoolName: "No.2 High School",
        sections: ["g4", "g5"]
    });
tempschool.save();


// End of temporary initilization


// //For testing objects-creation
// var schools;
// SchoolM.find(function (err, results) {
//     schools = results;
//     console.log(schools);
// })
