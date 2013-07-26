var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;

var MaterialM = require('./SchemaModels').Material;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempmaterial = new MaterialM({
        materialUUID: "m0001",
        materialName: "doc1",
        comment: "",
        dateOfCreation: "",
        dateOfModification: "",
        lastEditedBy: "",
        sourceUrl: "",
        materialType: ""
    });
tempmaterial.save();

tempmaterial = new MaterialM({
        materialUUID: "m0002",
        materialName: "doc2",
        comment: "",
        dateOfCreation: "",
        dateOfModification: "",
        lastEditedBy: "",
        sourceUrl: "",
        materialType: ""
    });
tempmaterial.save();

tempmaterial = new MaterialM({
        materialUUID: "m0003",
        materialName: "doc3",
        comment: "",
        dateOfCreation: "",
        dateOfModification: "",
        lastEditedBy: "",
        sourceUrl: "",
        materialType: ""
    });
tempmaterial.save();

// End of temporary initilization

// //For testing objects-creation
// var materials;
// MaterialM.find(function (err, results) {
//     materials = results;
//     console.log(materials);
// })

