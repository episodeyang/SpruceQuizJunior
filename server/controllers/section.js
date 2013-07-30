//Implementation of the APIs of Section
var _ =           require('underscore')
    , SectionM = require('../models/SchemaModels').Section
    , StudentM = require('../models/SchemaModels').Student
    , TeacherM = require('../models/SchemaModels').Teacher
    , SchoolM = require('../models/SchemaModels').School
    , UnitM = require('../models/SchemaModels').Unit
    , FeedM = require('../models/SchemaModels').Feed

module.exports = {
	getbyId: function(req, res) {
    	if(req.params.uuid === "all") {
	        SectionM.find(function (err, results) {
	        	//console.log(results);
	            res.json(results);
	        });
	    }
	    else {
	        SectionM.findOne({ sectionUUID: req.params.uuid }, function (err, gresults) {
	        	SchoolM.findOne({ sections: { $all: [req.params.uuid] } }, function (err, sresults) {
	        		StudentM.find({ sections: { $all: [req.params.uuid] } }, {"userUUID": 1, "_id": 0}, function (err, uresults) {
	        			UnitM.find({ unitUUID: { $in: gresults.sectionUnits } }, function (err, dresults) {
	        				//console.log(gresults.sectionUnits);
		        			var results = gresults.toObject();
		        			results.school = sresults.schoolUUID;
		        			results.students = _.map(uresults, function(item) {return item.userUUID});
		        			results.sectionUnits = dresults;
				            //console.log(results);
				            res.json(results);
			            });
			    	});
		    	});
	    	});
	    };
	},
	removebyId: function(req, res) {
        SectionM.remove({ sectionUUID: req.params.uuid }, function (err) {
        	if(err) {
        		res.send(404, "Remove section failed.");
        	}
    	});
	},
	savebyId: function(req, res) {
		SectionM.count(function(err, results) {
            if (err) {
                console.log("uuid generating error");
            } else {
                var tempid = results + 1;
                //var newid = 'g' + ("000" + tempid).slice(-4);
                var newid = 'g' + tempid;
                //console.log(newid);
				var section = new SectionM(req.body);
				section.sectionUUID = newid;
				//console.log(section);
				section.save(function (err) {
					if (err) {
						res.send(404, "Save section failed.");
					}
				});
            }
        });
	},
	updatebyId: function(req, res) {
        SectionM.update({ userUUID: req.params.uuid }, req.body, function (err) {
        	if(err) {
        		res.send(404, "Update section failed.");
        	}
    	});
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
	},
	getUnits: function(req, res) {
        SectionM.findOne({ sectionUUID: req.params.uuid }, function (err, results) {
        	UnitM.find({ unitUUID: { $in: results.sectionUnits } }, function (err, dresults) {
	            //console.log(dresults);
            	res.json(dresults);
	    	});
    	});
	},
	getFeeds: function(req, res) {
		if(req.params.flim === "all") {
	        FeedM.find({ groupUUID: { $in: [req.params.uuid] } }, null, {sort: {'feedUUID': -1}}, function (err, results) {
	        	//console.log(results);
	            res.json(results);
	    	});
	    }
	    else {
	        FeedM.find({ groupUUID: { $in: [req.params.uuid] } }, null, {sort: {'feedUUID': -1}, limit: req.params.flim}, function (err, results) {
	        	//console.log(results);
	            res.json(results);
	    	});
	    };
	}
}