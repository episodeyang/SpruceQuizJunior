var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;
    //, userRoles =       require('../../client/js/routingConfig').userRoles;

var StudentM = require('./SchemaModels').Student;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempstudent = new StudentM({
        userUUID: "u1",
        firstName: "Alice",
        lastName: "Stark",
        dateOfBirth: "",
        gender: "Female",
        email: "astark@spruceaca.edu",
        phone: ["12345678", "87654321"],
        address: "aaa",
        profilePic: "",
        sections: ["g1", "g2"],
        schools: ["s1"],
        exams: ["e1", "e2"],
        comments: "big"
    });
tempstudent.save();

tempstudent = new StudentM({
        userUUID: "u2",
        firstName: "Bob",
        lastName: "Smith",
        dateOfBirth: "",
        gender: "Male",
        email: "bsmith@spruceaca.edu",
        phone: ["12345678", "87654321"],
        address: "bbb",
        profilePic: "",
        sections: ["g1", "g3"],
        schools: ["s1"],
        exams: ["e3", "e4"],
        comments: "little"
    });
tempstudent.save();

tempstudent = new StudentM({
        userUUID: "u3",
        firstName: "Charlie",
        lastName: "Thompson",
        dateOfBirth: "",
        gender: "Male",
        email: "cthompson@spruceaca.edu",
        phone: ["12345678", "87654321"],
        address: "ddd",
        profilePic: "",
        sections: ["g4", "g5"],
        schools: ["s2"],
        exams: ["e5", "e6"],
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

