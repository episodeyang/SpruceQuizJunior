//Implementation of the APIs of Problem
var _ =           require('underscore')
    , ProblemM = require('../models/SchemaModels').Problem

module.exports = {
    getbyId: function(req, res) {
    	if(req.params.uuid === 'all') {
	        ProblemM.find(function (err, results) {
	        	//console.log(results);
	            res.json(results);
	        });
	    }
	    else {
	        ProblemM.findOne({ problemUUID: req.params.uuid }, function (err, results) {
	            //console.log(results);
	            res.json(results);
	    	});
	    };
	}
}