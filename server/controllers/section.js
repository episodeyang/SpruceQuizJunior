//Implementation of the APIs of Section
var _ =           require('underscore')
    , StudentM = require('../models/SchemaModels').Student
    , TeacherM = require('../models/SchemaModels').Teacher

module.exports = {
    getStudents: function(req, res) {
    	if(req.params.uuid === "all") {
	        StudentM.find(function (err, results) {
	        	//console.log(results);
	            res.json(results);
	        });
	    }
	    else {
	        StudentM.find({ sections: { $all: [req.params.uuid] } }, function (err, results) {
	            //console.log(results);
	            res.json(results);
	    	});
	    };
	}
}