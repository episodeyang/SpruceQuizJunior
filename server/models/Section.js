var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;

var SectionM = require('./SchemaModels').Section;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempsection = new SectionM({
        sectionUUID: "g1",
        sectionName: "三年级一班",
        sectionDisplayName: "",
        sectionParent: "",
        sectionUnits: ["d1", "d2"]
    });
tempsection.save();

tempsection = new SectionM({
        sectionUUID: "g2",
        sectionName: "三年级二班",
        sectionDisplayName: "",
        sectionParent: "",
        sectionUnits: ["d1", "d2"]
    });
tempsection.save();

tempsection = new SectionM({
        sectionUUID: "g3",
        sectionName: "数学奥林匹克辅导",
        sectionDisplayName: "奥数（高中）",
        sectionParent: "",
        sectionUnits: ["d4", "d5"]
    });
tempsection.save();

tempsection = new SectionM({
        sectionUUID: "g4",
        sectionName: "浪漫主义欣赏",
        sectionDisplayName: "浪漫主义诗歌",
        sectionParent: "g2",
        sectionUnits: ["d6", "d7"]
    });
tempsection.save();



// End of temporary initilization


// //For testing objects-creation
// var sections;
// SectionM.find(function (err, results) {
//     sections = results;
//     console.log(sections);
// })
