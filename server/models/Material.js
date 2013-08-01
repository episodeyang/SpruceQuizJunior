var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;

var MaterialM = require('./SchemaModels').Material;

// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB
// Begin of temporary initilization
var tempmaterial = new MaterialM({
        materialUUID: "m1",
        materialName: "三元一次方程简介",
        comment: "",
        dateOfCreation: "",
        dateOfModification: "",
        lastEditedBy: "",
        sourceUrl: "",
        materialType: ""
    });
tempmaterial.save();

tempmaterial = new MaterialM({
        materialUUID: "m2",
        materialName: "抛物线的性质",
        comment: "",
        dateOfCreation: "",
        dateOfModification: "",
        lastEditedBy: "",
        sourceUrl: "",
        materialType: ""
    });
tempmaterial.save();

tempmaterial = new MaterialM({
        materialUUID: "m3",
        materialName: "那不是一颗流星",
        comment: "",
        dateOfCreation: "",
        dateOfModification: "",
        lastEditedBy: "",
        sourceUrl: "",
        materialType: "article"
    });
tempmaterial.save();

// End of temporary initilization

// //For testing objects-creation
// var materials;
// MaterialM.find(function (err, results) {
//     materials = results;
//     console.log(materials);
// })

