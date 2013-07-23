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
        firstName: "Alice",
        lastName: "Stark",
        dateOfBirth: "",
        sex: "Female",
        email: "astark@spruceaca.edu",
        phone: ["12345678", "87654321"],
        address: "aaa",
        profilePic: "",
        sections: ["g0001", "g0002"],
        schools: ["s0001"],
        exams: ["e0001", "e0002"],
        comments: "big"
    });
tempstudent.save();

tempstudent = new StudentM({
        userUUID: "u0002",
        firstName: "Bob",
        lastName: "Smith",
        dateOfBirth: "",
        sex: "Male",
        email: "bsmith@spruceaca.edu",
        phone: ["12345678", "87654321"],
        address: "bbb",
        profilePic: "",
        sections: ["g0001", "g0003"],
        schools: ["s0001"],
        exams: ["e0003", "e0004"],
        comments: "little"
    });
tempstudent.save();

tempstudent = new StudentM({
        userUUID: "u0003",
        firstName: "Charlie",
        lastName: "Thompson",
        dateOfBirth: "",
        sex: "Male",
        email: "cthompson@spruceaca.edu",
        phone: ["12345678", "87654321"],
        address: "ddd",
        profilePic: "",
        sections: ["g0004", "g0005"],
        schools: ["s0002"],
        exams: ["e0005", "e0006"],
        comments: ""
    });
tempstudent.save();

// End of temporary initilization


// //For testing objects-creation
// var students;
// StudentM.find(function (err, results) {
//     students = results;
//     console.log(students);
// })

