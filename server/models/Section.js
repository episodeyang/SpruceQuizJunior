var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;

var SectionM = require('./SchemaModels').Section;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempsection = new SectionM({
        sectionUUID: "g0001",
        sectionName: "Section No.1",
        sectionUnits: ["d0001", "d0002"]
    });
tempsection.save();

tempsection = new SectionM({
        sectionUUID: "g0002",
        sectionName: "Section No.2",
        sectionUnits: ["d0001", "d0002"]
    });
tempsection.save();

tempsection = new SectionM({
        sectionUUID: "g0003",
        sectionName: "Section No.3",
        sectionUnits: ["d0001", "d0002"]
    });
tempsection.save();

tempsection = new SectionM({
        sectionUUID: "g0004",
        sectionName: "Section No.4",
        sectionUnits: ["d0001", "d0002"]
    });
tempsection.save();

tempsection = new SectionM({
        sectionUUID: "g0005",
        sectionName: "Section No.5",
        sectionUnits: ["d0001", "d0002"]
    });
tempsection.save();


// End of temporary initilization


// //For testing objects-creation
// var sections;
// SectionM.find(function (err, results) {
//     sections = results;
//     console.log(sections);
// })
