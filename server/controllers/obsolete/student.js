'use strict';

//Implementation of the APIs of Student
var _ =           require('underscore')
    , SchoolM = require('../../models/SchemaModels').School
    , StudentM = require('../../models/SchemaModels').Student
    , TeacherM = require('../../models/SchemaModels').Teacher
    , SectionM = require('../../models/SchemaModels').Section
    , ErratumM = require('../../models/SchemaModels').Erratum
    , ProblemNoteM = require('../../models/SchemaModels').ProblemNote
    , FeedM = require('../../models/SchemaModels').Feed;

module.exports = {
    getErrata: function(req, res) {
        StudentM.findOne({ _id: req.user.userId }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Student was not found or an error occurred");
            } else if (req.params.id === "all") {
                ErratumM.find({ _id: { $in: aresult.errata } }, function (err, results) {
                    if(err || !results) {
                        res.send(404, "No erratum was found or an error occurred");
                    } else {
                        //console.log(results);
                        res.json(results);
                    }
                });
            } else {
                ErratumM.findOne({ _id: req.params.id })
                    .populate('problems')
                    .exec(function (err, results) {
                        if(err || !results) {
                            res.send(404, "Erratum was not found or an error occurred");
                        } else if( aresult.errata.indexOf(results._id) === -1 ) {
                            console.log("Operation was not authorized.");
                            res.send(404, "Operation was not authorized.");
                        } else {
                            //console.log(results);
                            res.json(results);
                        }
                    });
            }
        });
    },
    createErrata: function(req, res) {
        StudentM.findOne({ _id: req.user.userId }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Student was not found or an error occurred");
            } else {
                var erratum = new ErratumM(req.body);
                //console.log(erratum);
                erratum.save(function (err) {
                    if (err) {
                        res.send(404, "Save erratum failed.");
                    }
                    else {
                        aresult.errata.push(erratum._id);
                        StudentM.update({ _id: req.user.userId }, {errata: aresult.errata}, function (err) {
                            if (err) {
                                res.send(404, "Update erratum failed.");
                            }else {
                                res.send(200, "create erratum success");
                            }
                        });
                    }
                });
            }
        });
    },
    updateErrata: function(req, res) {
        StudentM.findOne({ _id: req.user.userId }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Student was not found or an error occurred");
            } else {
                ErratumM.findOne({ _id: req.params.id }, function (err, results) {
                    if(err || !results) {
                        res.send(404, "Erratum was not found or an error occurred");
                    } else if( aresult.errata.indexOf(results._id) === -1 ) {
                        console.log("Operation was not authorized.");
                        res.send(404, "Operation was not authorized.");
                    } else {
                        delete req.body._id;
                        ErratumM.update({ _id: req.params.id }, req.body, function (err) {
                            if (err) {
                                res.send(404, "Update erratum failed.");
                            }else {
                                res.send(200, "update erratum success");
                            }
                        });
                    }
                });
            }
        });
    },
    removeErrata: function(req, res) {
        StudentM.findOne({ _id: req.user.userId }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Student was not found or an error occurred");
            } else {
                ErratumM.findOne({ _id: req.params.id }, function (err, results) {
                    if(err || !results) {
                        res.send(404, "Erratum was not found or an error occurred");
                    } else if( aresult.errata.indexOf(results._id) === -1 ) {
                        console.log("Operation was not authorized.");
                        res.send(404, "Operation was not authorized.");
                    } else {
                        ErratumM.remove({ _id: req.params.id }, function (err) {
                            if (err) {
                                res.send(404, "Remove erratum failed.");
                            }
                            else {
                                aresult.errata.remove(req.params.id);
                                StudentM.update({ _id: req.user.userId }, {errata: aresult.errata}, function (err) {
                                    if (err) {
                                        res.send(404, "Update erratum failed.");
                                    }else {
                                        res.send(200, "update erratum success");
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    getProblemNotes: function(req, res) {
        ErratumM.findOne({ _id: req.params.eid }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Erratum was not found or an error occurred");
            } else if (req.params.id === "all") {
                //var sortMetric = req.query.sort;
                //console.log("limit" + req.query.problemNoteListLimit);
                ProblemNoteM.find({ _id: { $in: aresult.problemNotes } }, null,
                                  { sort: req.query.sort, //sort: {'_id': -1} //sort: sortMetric
                                    limit: req.query.problemNoteListLimit},
                                    function (err, results) {
                    if(err || !results) {
                        res.send(404, "No problemNote was found or an error occurred");
                    } else {
                        //console.log(results);
                        res.json(results);
                    }
                });
            } else {
                ProblemNoteM.findOne({ _id: req.params.id })
                    .populate('problemId')
                    .exec(function (err, results) {
                        if(err || !results) {
                            res.send(404, "ProblemNote was not found or an error occurred");
                        } else if( aresult.problemNotes.indexOf(results._id) === -1 ) {
                            console.log("Operation was not authorized.");
                            res.send(404, "Operation was not authorized.");
                        } else {
                            //console.log(results);
                            res.json(results);
                        }
                    });
            }
        });
    },
    createProblemNotes: function(req, res) {
        ErratumM.findOne({ _id: req.params.eid }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Erratum was not found or an error occurred");
            } else {
                delete req.body.eid;
                var problemNote = new ProblemNoteM(req.body);
                //console.log(problemNote);
                problemNote.save(function (err) {
                    if (err) {
                        res.send(404, "Save problemNote failed.");
                    }
                    else {
                        aresult.problemNotes.push(problemNote._id);
                        ErratumM.update({ _id: req.params.eid }, {problemNotes: aresult.problemNotes}, function (err) {
                            if (err) {
                                res.send(404, "Update problemNote failed.");
                            }else {
                                res.send(200, "create problemNote success");
                            }
                        });
                    }
                });
            }
        });
    },
    updateProblemNotes: function(req, res) {
        ErratumM.findOne({ _id: req.params.eid }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Erratum was not found or an error occurred");
            } else {
                ProblemNoteM.findOne({ _id: req.params.id }, function (err, results) {
                    if(err || !results) {
                        res.send(404, "ProblemNote was not found or an error occurred");
                    } else if( aresult.problemNotes.indexOf(results._id) === -1 ) {
                        console.log("Operation was not authorized.");
                        res.send(404, "Operation was not authorized.");
                    } else {
                        delete req.body.eid;
                        delete req.body._id;
                        ProblemNoteM.update({ _id: req.params.id }, req.body, function (err) {
                            if (err) {
                                res.send(404, "Update problemNote failed.");
                            }else {
                                res.send(200, "update problemNote success");
                            }
                        });
                    }
                });
            }
        });
    },
    removeProblemNotes: function(req, res) {
        ErratumM.findOne({ _id: req.params.eid }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Erratum was not found or an error occurred");
            } else {
                ProblemNoteM.findOne({ _id: req.params.id }, function (err, results) {
                    if(err || !results) {
                        res.send(404, "ProblemNote was not found or an error occurred");
                    } else if( aresult.problemNotes.indexOf(results._id) === -1 ) {
                        console.log("Operation was not authorized.");
                        res.send(404, "Operation was not authorized.");
                    } else {
                        ProblemNoteM.remove({ _id: req.params.id }, function (err) {
                            if (err) {
                                res.send(404, "Remove problemNote failed.");
                            }
                            else {
                                aresult.problemNotes.remove(req.params.id);
                                ErratumM.update({ _id: req.params.eid }, {problemNotes: aresult.problemNotes}, function (err) {
                                    if (err) {
                                        res.send(404, "Remove problemNote failed.");
                                    }else {
                                        res.send(200, "Remove problemNote success");
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    //old functions below
    getbyId: function(req, res) {
    	if(req.params.uuid === "all") {
	        StudentM.find(null, null, {sort: {'userUUID': 1}}, function (err, results) {
	        	//console.log(results);
	            res.json(results);
	        });
	    }
	    else {
	        StudentM.findOne({ userUUID: req.params.uuid }, function (err, results) {
	            //console.log(results);
	            res.json(results);
	    	});
	    }
	},
	removebyId: function(req, res) {
        StudentM.remove({ userUUID: req.params.uuid }, function (err) {
        	if(err) {
        		res.send(404, "Remove student failed.");
        	}
    	});
	},
	savebyId: function(req, res) {
		var student = new StudentM(req.body);
		console.log(student);
		student.save(function (err) {
			if (err) {
				res.send(404, "Save student failed.");
			}
		});
	},
	updatebyId: function(req, res) {
		//console.log(req.body);
		//console.log(req.params.uuid);
        StudentM.update({ userUUID: req.params.uuid }, req.body, function (err) {
        	if(err) {
        		res.send(404, "Update student failed.");
        	}
    	});
	},
	getSchools: function(req, res) {
        StudentM.findOne({ userUUID: req.params.uuid }, function (err, results) {
        	if(!results) {
        		console.log("Student was not found");
        	} else {
	    		SchoolM.find({ schoolUUID: { $in: results.schools } }, function (err, sresults) {
		            //console.log(sresults);
		            res.json(sresults);
		        });
		    }
    	});
	},
	getTeachers: function(req, res) {
        StudentM.findOne({ userUUID: req.params.uuid }, function (err, results) {
        	if(!results) {
        		console.log("Student was not found");
        	} else {
		        TeacherM.find({ sections: { $in: results.sections } }, function (err, tresults) {
		            res.json(tresults);
		    	});
		    }
    	});
	},
	getSections: function(req, res) {
        StudentM.findOne({ userUUID: req.params.uuid }, function (err, results) {
        	if(!results) {
        		console.log("Student was not found");
        	} else {
		        SectionM.find({ sectionUUID: { $in: results.sections } }, function (err, gresults) {
		        	//console.log(results.sections);
		        	//console.log(gresults);
		            res.json(gresults);
		    	});
	    	}
    	});
	},
	getFeeds: function(req, res) {
		if(req.params.flim === "all") {
	        FeedM.find({ userUUID: { $in: [req.params.uuid] } }, null, {sort: {'feedUUID': -1}}, function (err, results) {
	        	//console.log(results);
	            res.json(results);
	    	});
	    }
	    else {
	        FeedM.find({ userUUID: { $in: [req.params.uuid] } }, null, {sort: {'feedUUID': -1}, limit: req.params.flim}, function (err, results) {
	        	//console.log(results);
	            res.json(results);
	    	});
	    };
	}
}