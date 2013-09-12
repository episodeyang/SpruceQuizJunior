//Implementation of the APIs of Admin
var _ = require('underscore')
    , AdminM = require('../models/SchemaModels').Admin
    , SectionM = require('../models/SchemaModels').Section;
//, StudentM = require('../models/SchemaModels').Student

module.exports = {
    getSections: function (req, res) {
        AdminM.findOne({ _id: req.user.userId }), {"schools": 1, "_id": 0}, function (err, aschools) {
            console.log(aschools);
            if (req.params.id === "all") {
                SectionM.find({ school: { $in: aschools } }, function (err, results) {
                    //console.log(results);
                    res.json(results);
                });
            }
            else {
                //console.log(req.user.userId);
                SectionM.findOne({ _id: req.params.id, school: { $in: aschools } })
                    .populate('sectionUnits')
                    .exec(function (err, results) {
                        //console.log(results);
                        res.json(results);
                    });
            }
        }
    }
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