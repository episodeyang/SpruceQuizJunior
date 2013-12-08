'use strict';
angular.module('SpruceQuizApp')
.controller('SectionCtrl',
['$filter','$rootScope', '$scope', 'Admins', 'Students', //, 'Sections','Units','Materials','Model',
    function($filter, $rootScope, $scope, Admins, Students){//, Sections, Units, Materials, Model) {
    $scope.expression = "\\( \\frac{5}{4} \\div \\frac{1}{6} \\)";
    $scope.highlightField = "question";
    $scope.problemTypes = ['multipleChoice','fillIn','OpenEnded'];

//    Model.init();
//    $scope.shownVar = Model.users;
    //Model.init();
    //$scope.Model = Model;
    //$scope.list = [];
    $scope.newSection = {};
    $scope.model={};
    //$scope.model.sections = Students.onSections.get({uuid: 'u1'});
//    $scope.updateSection = function(index){
//        Admins.onSections.create({
//            sectionName: "三一班",
//            sectionDisplayName: "",
//            sectionParent: null
//        });
////        Sections.onUnits.get({uuid: $scope.model.sections[index].sectionUUID}
////            ,function(results){
////                //console.log(results);
////                $scope.model.sections[index].sectionUnits = results;
////                if(results === []) {
////                    $scope.grabMaterials(results[0].unitUUID);
////                }
////            }
////        );
//    };

//    $scope.model.unitID = "d1";
//    $scope.grabMaterials = function(unitId){
//        $scope.model.tempUnit = Units.onUnits.get({uuid: unitId});
//    };
//
    $scope.createNewSection = function(){
        $scope.newSection.sectionUUID = "new";
        $scope.newSection.sectionUnits = [];
//        var test = Admins.onSections.list();
//        console.log(test);
//        Admins.onSections.create({
//            sectionName: "三一班",
//            sectionDisplayName: "",
//            school: "5232acad594a228610000009",
//            sectionParent: null,
//            sectionUnit: null
//        });
//        Admins.onSections.update({
//            id: "5232b25d0084571411000002",
//            sectionName: "三班"
//        });
//        Admins.onSections.remove({
//            id: "5232b25d0084571411000002"
//        });
//        Sections.onSections.save($scope.newSection, function (result) {
//            $scope.model.sections.push(result);
//            Students.onStudents.get({uuid: 'u1'}, function (tempS) {
//                tempS.sections.push(result.sectionUUID);
//                Students.onStudents.update({uuid: 'u1', sections: tempS.sections});
//            });
//        });

//        Students.onProblemNotes.create({
//            eid: "529830439db53af76a000019",
//            problemId: "529830439db53af76a000010",   //the problem that this note relates to
//            tagName: "统测",
//            mainText: "test",
//            note: "审题不清"
//        });
//        Students.onProblemNotes.update({
//            eid: "529830439db53af76a000019",
//            id: "52a2cbe6e67bfe0321000002",
//            note: "审题不清222"
//        });
//        Students.onProblemNotes.remove({
//            eid: "529830439db53af76a000019",
//            id: "52a2cde33427294c21000002"
//        });                     //Note: not remove the problem!!  @Ge: you also need to call another API to remove problem
        $scope.createSectionModal = false;
        //$scope.list.push($scope.newSection);
    };
}]);
