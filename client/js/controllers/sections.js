'use strict';
angular.module('SpruceQuizApp')
.controller('SectionCtrl',
['$filter','$rootScope', '$scope', 'Sections','Units','Materials','Students',
    function($filter, $rootScope, $scope, Sections, Units, Materials, Students) {
    $scope.expression = "\\( \\frac{5}{4} \\div \\frac{1}{6} \\)";
    $scope.highlightField = "question";
    $scope.problemTypes = ['multipleChoice','fillIn','OpenEnded'];

//    Model.init();
//    $scope.shownVar = Model.users;
    $scope.shownVar = 'haha';
//    Model.init();
//    $scope.shownVar = Model.user;

    //$scope.list = [];
    $scope.newSection = {};
    $scope.model={};
    $scope.model.sections = Students.onSections.get({uuid: 'u1'});
    $scope.updateSection = function(index){
        Sections.onUnits.get({uuid: $scope.model.sections[index].sectionUUID}
            ,function(results){
                //console.log(results);
                $scope.model.sections[index].sectionUnits = results;
                if(results === []) {
                    $scope.grabMaterials(results[0].unitUUID);
                }
            }
        );
    }

    $scope.model.unitID = "d1";
    $scope.grabMaterials = function(unitId){
        $scope.model.tempUnit = Units.onUnits.get({uuid: unitId});
    };

    $scope.createNewSection = function(){
        $scope.newSection.sectionUUID = "new";
        $scope.newSection.sectionUnits = [];
        Sections.onSections.save($scope.newSection, function (result) {
            $scope.model.sections.push(result); 
            Students.onStudents.get({uuid: 'u1'}, function (tempS) {
                tempS.sections.push(result.sectionUUID);
                Students.onStudents.update({uuid: 'u1', sections: tempS.sections});
            });
        });
        $scope.createSectionModal = false;
        //$scope.list.push($scope.newSection);
    };
}]);
