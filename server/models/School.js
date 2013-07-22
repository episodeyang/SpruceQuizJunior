var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;
    //, userRoles =       require('../../client/js/routingConfig').userRoles;

var SchoolM = require('./SchemaModels').School;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempschool = new SchoolM({
        schoolUUID: "s0001",
        schoolName: "No.1 High School",
        sections: ["g0001", "g0002", "g0003"]
    });
tempschool.save();

tempschool = new SchoolM({
        schoolUUID: "s0002",
        schoolName: "No.2 High School",
        sections: ["g0004", "g0005"]
    });
tempschool.save();


// End of temporary initilization


// //For testing objects-creation
// var schools;
// SchoolM.find(function (err, results) {
//     schools = results;
//     console.log(schools);
// })
