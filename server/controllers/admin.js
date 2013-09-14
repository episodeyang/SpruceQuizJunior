'use strict';

//Implementation of the APIs of Admin
var _ = require('underscore');
var AdminM = require('../models/SchemaModels').Admin;
var SectionM = require('../models/SchemaModels').Section;
var SchoolM = require('../models/SchemaModels').School;
//, StudentM = require('../models/SchemaModels').Student

module.exports = {
    getSections: function (req, res) {
        AdminM.findOne({ _id: req.user.userId }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Admin was not found or an error occurred");
            } else if (req.params.id === "all") {
                SectionM.find({ school: { $in: aresult.schools } }, function (err, results) {
                    if(err || !results) {
                        res.send(404, "No section was not found or an error occurred");
                    } else {
                        //console.log(results);
                        res.json(results);
                    }
                });
            } else {
                SectionM.findOne({ _id: req.params.id })
                .populate('sectionUnits')
                .exec(function (err, results) {
                    if(err || !results) {
                        res.send(404, "Section was not found or an error occurred");
                    } else if( aresult.schools.indexOf(results.school) === -1 ) {
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
    createSections: function(req, res) {
        AdminM.findOne({ _id: req.user.userId }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Admin was not found or an error occurred");
            } else {
                var section = new SectionM(req.body);
                //console.log(section);
                if( aresult.schools.indexOf(section.school) === -1 ) {
                    console.log("Operation was not authorized.");
                    res.send(404, "Not authorized to create section out of administrated schools.");
                } else {
                    section.save(function (err) {
                        if (err) {
                            res.send(404, "Save student failed.");
                        }
                    });
                }
            }
        });
    },
    updateSections: function(req, res) {
        AdminM.findOne({ _id: req.user.userId }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Admin was not found or an error occurred");
            } else {
                SectionM.findOne({ _id: req.params.id }, function (err, results) {
                    if(err || !results) {
                        res.send(404, "Section was not found or an error occurred");
                    } else if( aresult.schools.indexOf(results.school) === -1 ) {
                        console.log("Operation was not authorized.");
                        res.send(404, "Operation was not authorized.");
                    } else {
                        delete req.body._id;
                        SectionM.update({ _id: req.params.id }, req.body, function (err) {
                            if (err) {
                                res.send(404, "Update student failed.");
                            }
                        });
                    }
                });
            }
        });
    },
    removeSections: function(req, res) {
        AdminM.findOne({ _id: req.user.userId }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Admin was not found or an error occurred");
            } else {
                SectionM.findOne({ _id: req.params.id }, function (err, results) {
                    if(err || !results) {
                        res.send(404, "Section was not found or an error occurred");
                    } else if( aresult.schools.indexOf(results.school) === -1 ) {
                        console.log("Operation was not authorized.");
                        res.send(404, "Operation was not authorized.");
                    } else {
                        SectionM.remove({ _id: req.params.id }, function (err) {
                            if (err) {
                                res.send(404, "Remove student failed.");
                            }
                        });
                    }
                });
            }
        });
    },
    getSchools: function (req, res) {
        AdminM.findOne({ _id: req.user.userId }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Admin was not found or an error occurred");
            } else if (req.params.id === "all") {
                SchoolM.find({ _id: { $in: aresult.schools } }, function (err, results) {
                    if(err || !results) {
                        res.send(404, "No school was not found or an error occurred");
                    } else {
                        //console.log(results);
                        res.json(results);
                    }
                });
            } else {
                SchoolM.findOne({ _id: req.params.id })
                .exec(function (err, results) {
                    if(err || !results) {
                        res.send(404, "School was not found or an error occurred");
                    } else if( aresult.schools.indexOf(results._id) === -1 ) {
                        console.log("Operation was not authorized.");
                        res.send(404, "Operation was not authorized.");
                    } else {
                        //console.log(results);
                        res.json(results);
                    }
                });
            }
        });
    }
};