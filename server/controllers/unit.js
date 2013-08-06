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
	        	if(!aresults) {
	        		console.log("Unit was not found");
	        	} else {
	        		MaterialM.find({ materialUUID: { $in: aresults.items } }, function (err, bresults) {
	        			UnitM.find({ unitUUID: { $in: aresults.child } }, function (err, cresults) {
		        			var results = aresults.toObject();
		        			results.child = cresults;
		        			results.items = bresults;
				            //console.log(results);
				            res.json(results);
			            });
			    	});
			    }
	    	});
	    };
	},
	getArchived: function(req, res) {
        UnitM.findOne({ unitUUID: req.params.uuid }, function (err, aresults) {
        	if(!aresults) {
        		console.log("Unit was not found");
        	} else {
				MaterialM.find({ materialUUID: { $in: aresults.archived } }, function (err, cresults) {
					//console.log(aresults.archived);
					//console.log(cresults);
		            res.json(cresults);
	            });
			}
    	});
	},
	updatebyId: function(req, res) {
		UnitM.findOne({ unitUUID: req.params.uuid }, function (err, aresults) {
        	if(!results) {
        		console.log("Unit was not found");
        	} else {
		    	if(req.params.toArchive === "true") {
		    		var pos = _.indexOf(aresults.items, req.params.mid);
		    		if(pos == -1) {
		    			res.send(404, "The material is not found in the existing list.");
		    		}
		    		else {
		    			aresults.items.splice(pos, 1);
		    			aresults.archived.push(req.params.mid);
		    			//console.log(aresults);
		    			UnitM.update({ unitUUID: req.params.uuid }, { items: aresults.items, archived: aresults.archived }, function (err, cresults) {
				        	if(err) {
				        		res.send(404, "Archive update error.");
				        	}
		    			});
		    		}
			    }
			    else {
		    		var pos = _.indexOf(aresults.archived, req.params.mid);
		    		if(pos == -1) {
		    			res.send(404, "The material is not found in archive.");
		    		}
		    		else {
		    			aresults.archived.splice(pos, 1);
		    			aresults.items.push(req.params.mid);
		    			//console.log(aresults);
		    			UnitM.update({ unitUUID: req.params.uuid }, { items: aresults.items, archived: aresults.archived }, function (err, cresults) {
				        	if(err) {
				        		res.send(404, "Archive update error.");
				        	}
		    			});
		    		}
			    };
			}
	    });
	}
}