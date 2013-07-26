//Implementation of the APIs of Material
var _ =           require('underscore')
    , MaterialM = require('../models/SchemaModels').Material

module.exports = {
    getbyId: function(req, res) {
    	if(req.params.uuid === "all") {
	        MaterialM.find(function (err, results) {
	        	//console.log(results);
	            res.json(results);
	        });
	    }
	    else {
	        MaterialM.findOne({ materialUUID: req.params.uuid }, function (err, results) {
	            //console.log(results);
	            res.json(results);
	    	});
	    };
	}
}