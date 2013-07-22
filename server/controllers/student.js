//Implementation of the APIs of Student
var _ =           require('underscore')
    , StudentM = require('../models/SchemaModels').Student

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
	}
}