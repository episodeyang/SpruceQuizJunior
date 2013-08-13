//Implementation of the APIs of Teacher
var _ =           require('underscore')
    , TeacherM = require('../models/SchemaModels').Teacher
	, StudentM = require('../models/SchemaModels').Student

module.exports = {
    getbyId: function(req, res) {
    	if(req.params.uuid === "all") {
	        TeacherM.find(null, null, {sort: {'userUUID': 1}}, function (err, results) {
	        	//console.log(results);
	            res.json(results);
	        });
	    }
	    else {
	        TeacherM.findOne({ userUUID: req.params.uuid }, function (err, results) {
	            //console.log(results);
	            res.json(results);
	    	});
	    };
	},
	removebyId: function(req, res) {
        TeacherM.remove({ userUUID: req.params.uuid }, function (err) {
        	if(err) {
        		res.send(404, "Remove teacher failed.");
        	}
    	});
	},
	getSections: function(req, res) {
        TeacherM.findOne({ userUUID: req.params.uuid }, function (err, results) {
            //console.log(results);
            res.json(results.sections);
    	});
	},
	getSchools: function(req, res) {
        TeacherM.findOne({ userUUID: req.params.uuid }, function (err, results) {
            //console.log(results);
            res.json(results.schools);
    	});
	},
	getStudents: function(req, res) {
        TeacherM.findOne({ userUUID: req.params.uuid }, function (err, results) {
        	if(!results) {
        		console.log("Teacher was not found");
        	} else {
	        	//console.log(results.sections);
		        StudentM.find({ sections: { $in: results.sections } }, function (err, sresults) {
		            res.json(sresults);
		    	});
		    }
    	});
	}
}