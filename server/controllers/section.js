//Implementation of the APIs of Section
var _ =           require('underscore')
    , SectionM = require('../models/SchemaModels').Section
    , StudentM = require('../models/SchemaModels').Student
    , TeacherM = require('../models/SchemaModels').Teacher
    , SchoolM = require('../models/SchemaModels').School

module.exports = {
	getbyId: function(req, res) {
    	if(req.params.uuid === "all") {
	        SectionM.find(function (err, results) {
	        	//console.log(results);
	            res.json(results);
	        });
	    }
	    else {
	        SectionM.findOne({ sectionUUID: req.params.uuid }, function (err, results) {
	            //console.log(results);
	            res.json(results);
	    	});
	    };
	},
    getStudents: function(req, res) {
        StudentM.find({ sections: { $all: [req.params.uuid] } }, function (err, results) {
            //console.log(results);
            res.json(results);
    	});
	},
	getTeachers: function(req, res) {
        TeacherM.find({ sections: { $all: [req.params.uuid] } }, function (err, results) {
            //console.log(results);
            res.json(results);
    	});
	},
	getSchools: function(req, res) {
        SchoolM.find({ sections: { $all: [req.params.uuid] } }, function (err, results) {
            //console.log(results);
            res.json(results);
    	});
	}
}