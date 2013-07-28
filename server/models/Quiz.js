var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;

var QuizM = require('./SchemaModels').Quiz;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempquiz = new QuizM({
	    quizUUID: "q1",
	    quizTitle: "Quiz template",
	    quizDate: "",
	    quizTopics: ["math", "geometry", "algebra"],
	    totalScore: 100,
	    quizProblems: [{
		    problemUUID: "p0002",
		    weight: 30
	    }, {
		    problemUUID: "p0001",
		    weight: 70
	    }]
    });
tempquiz.save();

// End of temporary initilization


// //For testing objects-creation
// var quizzes;
// QuizM.find(function (err, results) {
//     quizzes = results;
//     console.log(quizzes);
// })

