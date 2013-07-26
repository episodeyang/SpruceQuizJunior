//Implementation of the APIs of Unit
var _ =           require('underscore')
    , UnitM = require('../models/SchemaModels').Unit

module.exports = {
    getbyId: function(req, res) {
    	if(req.params.uuid === "all") {
	        UnitM.find(function (err, results) {
	        	//console.log(results);
	            res.json(results);
	        });
	    }
	    else {
	        UnitM.findOne({ unitUUID: req.params.uuid }, function (err, results) {
	            //console.log(results);
	            res.json(results);
	    	});
	    };
	}
}