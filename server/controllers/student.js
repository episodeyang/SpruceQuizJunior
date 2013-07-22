//Implementation of the APIs of Student
var _ =           require('underscore')
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
	getSchools: function(req, res) {
        StudentM.findOne({ userUUID: req.params.uuid }, function (err, results) {
            //console.log(results);
            res.json(results.schools);
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