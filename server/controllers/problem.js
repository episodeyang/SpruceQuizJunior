//Implementation of the APIs of Problem
var _ =           require('underscore')
    , ProblemM = require('../models/SchemaModels').Problem

module.exports = {
    getbyId: function(req, res) {
    	if(req.params.uuid === "all") {
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
	},
	savebyId: function(req, res) {
		ProblemM.count(function(err, results) {
            if (err) {
                console.log("uuid generating error");
            } else {
                var tempid = results + 1;
                var newid = 'p' + tempid;
                //console.log(newid);
				var problem = new ProblemM(req.body);
				problem.problemUUID = newid;
				//console.log(problem);
				problem.save(function (err) {
					if (err) {
						res.send(404, "Save problem failed.");
					}
				});
            }
        });
	}
}