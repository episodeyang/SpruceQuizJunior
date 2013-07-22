//Implementation of the APIs of School
var _ =           require('underscore')
    , SchoolM = require('../models/SchemaModels').School
    , StudentM = require('../models/SchemaModels').Student
    , TeacherM = require('../models/SchemaModels').Teacher

module.exports = {
    getbyId: function(req, res) {
    	if(req.params.uuid === "all") {
	        SchoolM.find(function (err, results) {
	        	//console.log(results);
	            res.json(results);
	        });
	    }
	    else {
	        SchoolM.findOne({ schoolUUID: req.params.uuid }, function (err, results) {
	            //console.log(results);
	            res.json(results);
	    	});
	    };
	},
	getTeachers: function(req, res) {
        TeacherM.find({ schools: { $all: [req.params.uuid] } }, function (err, results) {
            //console.log(results);
            res.json(results);
    	});
	},
	getStudents: function(req, res) {
        StudentM.find({ schools: { $all: [req.params.uuid] } }, function (err, results) {
            //console.log(results);
            res.json(results);
    	});
	},
	getSections: function(req, res) {
        SchoolM.findOne({ schoolUUID: req.params.uuid }, function (err, results) {
            //console.log(results);
            res.json(results.sections);
    	});
	}
}