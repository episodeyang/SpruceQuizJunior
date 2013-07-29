//Implementation of the APIs of Unit
var _ =           require('underscore')
    , UnitM = require('../models/SchemaModels').Unit
    , MaterialM = require('../models/SchemaModels').Material

module.exports = {
    getbyId: function(req, res) {
    	if(req.params.uuid === "all") {
	        UnitM.find(function (err, results) {
	        	//console.log(results);
	            res.json(results);
	        });
	    }
	    else {
	        UnitM.findOne({ unitUUID: req.params.uuid }, function (err, aresults) {
        		MaterialM.find({ materialUUID: { $in: aresults.items } }, function (err, bresults) {
        			UnitM.find({ unitUUID: { $in: aresults.child } }, function (err, cresults) {
	        			var results = aresults.toObject();
	        			results.child = cresults;
	        			results.items = bresults;
			            console.log(results);
			            res.json(results);
		            });
		    	});
	    	});
	    };
	}
}