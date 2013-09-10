var _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check;


// For initilizing Spruce database in MongoDB. Will be taken out later. Not needed if data is already in MongoDB

// Begin of temporary initilization
var tempmaterial = new MaterialM({
        materialUUID: "m1",
        materialName: "三元一次方程简介",
        comment: "什么是三元一次方程？请点击这里",
        dateOfCreation: "",
        dateOfModification: "",
        lastEditedBy: "episodeyang",
        sourceUrl: "http://baike.baidu.com/view/853269.htm",
        materialType: "webpage"
    });
tempmaterial.save();

tempmaterial = new MaterialM({
        materialUUID: "m2",
        materialName: "抛物线的性质",
        comment: "什么是抛物线？",
        dateOfCreation: "",
        dateOfModification: "",
        lastEditedBy: "lizhongchen",
        sourceUrl: "http://zh.wikipedia.org/wiki/%E6%8A%9B%E7%89%A9%E7%BA%BF",
        materialType: "webpage"
    });
tempmaterial.save();

tempmaterial = new MaterialM({
        materialUUID: "m3",
        materialName: "那不是一颗流星",
        comment: "语文第三册课文",
        dateOfCreation: "",
        dateOfModification: "",
        lastEditedBy: "吴轶凡",
        sourceUrl: "http://baike.baidu.com/view/1344225.htm",
        materialType: "webpage"
    });
tempmaterial.save();

// End of temporary initilization

// //For testing objects-creation
// var materials;
// MaterialM.find(function (err, results) {
//     materials = results;
//     console.log(materials);
// })

