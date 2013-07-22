var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;
    //, userRoles =       require('../../client/js/routingConfig').userRoles;

var StudentM = require('./SchemaModels').Student;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempstudent = new StudentM({
        userUUID: "u0001",
        studentName: "Alice",
        schoolGroup: ["g0001", "g0002"],
        exams: ["e0001", "e0002"]
    });
tempstudent.save();

tempstudent = new StudentM({
        userUUID: "u0002",
        studentName: "Bob",
        schoolGroup: ["g0001", "g0003"],
        exams: ["e0003", "e0004"]
    });
tempstudent.save();

tempstudent = new StudentM({
        userUUID: "u0003",
        studentName: "Charlie",
        schoolGroup: ["g0002", "g0003"],
        exams: ["e0005", "e0006"]
    });
tempstudent.save();
// End of temporary initilization


// //For testing objects-creation
// var students;
// StudentM.find(function (err, results) {
//     students = results;
//     console.log(students);
// })

