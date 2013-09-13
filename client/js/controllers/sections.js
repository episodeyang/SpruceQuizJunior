'use strict';
angular.module('SpruceQuizApp')
.controller('SectionCtrl',
['$filter','$rootScope', '$scope', 'Admins', //, 'Sections','Units','Materials','Students','Model',
    function($filter, $rootScope, $scope, Admins){//, Sections, Units, Materials, Students, Model) {
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
        var test = Admins.onSections.list();
        console.log(test);
        Admins.onSections.create({
            sectionName: "三一班",
            sectionDisplayName: "",
            sectionParent: null
        });
//        Sections.onSections.save($scope.newSection, function (result) {
//            $scope.model.sections.push(result);
//            Students.onStudents.get({uuid: 'u1'}, function (tempS) {
//                tempS.sections.push(result.sectionUUID);
//                Students.onStudents.update({uuid: 'u1', sections: tempS.sections});
//            });
//        });
        $scope.createSectionModal = false;
        //$scope.list.push($scope.newSection);
    };
}]);
