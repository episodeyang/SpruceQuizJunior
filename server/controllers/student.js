//Implementation of the APIs of Student
var _ =           require('underscore')
    , SchoolM = require('../models/SchemaModels').School
    , StudentM = require('../models/SchemaModels').Student
    , TeacherM = require('../models/SchemaModels').Teacher

module.exports = {
    getbyId: function(req, res) {
    	if(req.params.uuid === "all") {
	        StudentM.find(function (err, results) {
	        	//console.log(results);
	            res.json(results);
	        });
	    }
	    else {
	        StudentM.findOne({ userUUID: req.params.uuid }, function (err, results) {
	            //console.log(results);
	            res.json(results);
	    	});
	    };
	},
	removebyId: function(req, res) {
        StudentM.remove({ userUUID: req.params.uuid }, function (err) {
        	if(err) {
        		res.send(404, "Remove student failed.");
        	}
    	});
	},
	savebyId: function(req, res) {
		var student = new StudentM(req.body);
		console.log(student);
		student.save(function (err) {
			if (err) {
				res.send(404, "Save student failed.");
			}
		});
	},
	getSchools: function(req, res) {
        StudentM.findOne({ userUUID: req.params.uuid }, function (err, results) {
    		SchoolM.find({ schoolUUID: { $in: results.schools } }, function (err, sresults) {
	            //console.log(sresults);
	            res.json(sresults);
	        });
    	});
	},
	getTeachers: function(req, res) {
        StudentM.findOne({ userUUID: req.params.uuid }, function (err, results) {
	        TeacherM.find({ sections: { $in: results.sections } }, function (err, tresults) {
	            res.json(tresults);
	    	});
    	});
	}
}