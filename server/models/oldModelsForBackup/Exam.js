var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;

var ExamM = require('./../SchemaModels').Exam;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempexam = new ExamM({
	    examUUID: "e1",
	    examTitle: "Spring 2013 Mid-term Exam",
	    examDate: "",
	    section: "g1",
	    attendence: true,
	    totalScore: 100,
	    totalReceivedScore: 93,
	    rank: 2,
	    examProblems: [{
		    problemUUID: "p2",
		    problemType: "multipleChoice",
		    weight: 30,
		    receivedScore: 28,
		    studentAnswer: ['Washinton','Mrs. Adams']
	    }, {
		    problemUUID: "p1",
		    problemType: "OpenEnded",
		    weight: 70,
		    receivedScore: 65,
		    studentAnswer: ['根据题目中给出的信息，我们可以推断，小球附近电场为\\(E_0\\).','']
	    }]
    });
tempexam.save();

// End of temporary initilization


// //For testing objects-creation
// var exams;
// ExamM.find(function (err, results) {
//     exams = results;
//     console.log(exams);
// })

