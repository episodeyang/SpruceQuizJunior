var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;
    //, userRoles =       require('../../client/js/routingConfig').userRoles;

var TeacherM = require('./SchemaModels').Teacher;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempteacher = new TeacherM({
        userUUID: "u5",
        teacherName: "TeacherA",
        sections: ["g1"],
        schools: ["s1"]
    });
tempteacher.save();

tempteacher = new TeacherM({
        userUUID: "u6",
        teacherName: "TeacherB",
        sections: ["g1", "g2"],
        schools: ["s1"]
    });
tempteacher.save();

// End of temporary initilization


// //For testing objects-creation
// var teachers;
// TeacherM.find(function (err, results) {
//     teachers = results;
//     console.log(teachers);
// })