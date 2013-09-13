//Implementation of the APIs of Admin
var _ = require('underscore')
    , AdminM = require('../models/SchemaModels').Admin
    , SectionM = require('../models/SchemaModels').Section;
//, StudentM = require('../models/SchemaModels').Student

module.exports = {
    getSections: function (req, res) {
        AdminM.findOne({ _id: req.user.userId }, function (err, aresult) {
            if(err || !aresult) {
                res.send(404, "Admin was not found or an error occurred");
            } else if (req.params.id === "all") {
                SectionM.find({ school: { $in: aresult.schools } }, function (err, results) {
                    //console.log(results);
                    res.json(results);
                });
            } else {
                SectionM.findOne({ _id: req.params.id })
                .populate('sectionUnits')
                .exec(function (err, results) {
                    if(err || !results) {
                        res.send(404, "Section was not found or an error occured");
                    } else if( aresult.schools.indexOf(results.school) === -1 ) {
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
        var section = new SectionM(req.body);
        console.log(section);
        section.save(function (err) {
            if (err) {
                res.send(404, "Save student failed.");
            }
        });
    }
//    updateSections: function(req, res) {
//        //console.log(req.body);
//        //console.log(req.params.uuid);
//        StudentM.update({ userUUID: req.params.uuid }, req.body, function (err) {
//            if(err) {
//                res.send(404, "Update student failed.");
//            }
//        });
//    },
//    removeSections: function(req, res) {
//        StudentM.remove({ userUUID: req.params.uuid }, function (err) {
//            if(err) {
//                res.send(404, "Remove student failed.");
//            }
//        });
//        AdminM.findOne({ _id: req.user.userId }, function (err, aresult) {
//            if(err || !aresult) {
//                res.send(404, "Admin was not found or an error occurred");
//            } else {
//                SectionM.remove({ _id: req.params.id })
//                .exec(function (err) {
//                    if(err) {
//                        res.send(404, "Remove student failed.");
//                    } else if( aresult.schools.indexOf(results.school) === -1 ) {
//                        res.send(404, "Operation was not authorized.");
//                    } else {
//                        //console.log(results);
//                        res.json(results);
//                    }
//                });
//            }
//        });
//    }
//    getSchools: function (req, res) {
//        TeacherM.findOne({ userUUID: req.params.uuid }, function (err, results) {
//            //console.log(results);
//            res.json(results.schools);
//        });
//    },
//    getStudents: function (req, res) {
//        TeacherM.findOne({ userUUID: req.params.uuid }, function (err, results) {
//            if (!results) {
//                console.log("Teacher was not found");
//            } else {
//                //console.log(results.sections);
//                StudentM.find({ sections: { $in: results.sections } }, function (err, sresults) {
//                    res.json(sresults);
//                });
//            }
//        });
//    }
}