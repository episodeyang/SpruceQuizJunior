'use strict';

/* Controllers */

angular.module('SpruceQuizApp')
.controller('SectionCtrl',
['$rootScope', '$scope', 'Sections','Units', function($rootScope, $scope, Sections, Units) {
//function ProblemCtrl($scope, Problems) 
    //$rootScope.error = "Temp warning";
    $scope.expression = "\\( \\frac{5}{4} \\div \\frac{1}{6} \\)";
    $scope.highlightField = "question";
    $scope.problemTypes = ['multipleChoice','fillIn','OpenEnded'];

    //Use the next two lines if accessing a specific problem with a uuid
    //$scope.problems = [];
    //$scope.problems.push(Problems.get({uuid: "p0001"}));
    $scope.list = [];
    $scope.newSection = {};
    //Use the next line to get all problems
//    $scope.problems = Problems.list();

    //old way using $http
    // Problems.getAll(function(res) {
    //     $scope.problems = res;
    // }, function(err) {
    //     $rootScope.error = "Failed to fetch problems.";
    // });

    // Problems.getbyId(function(res) {
    //     $scope.problems = res;
    // }, function(err) {
    //     $rootScope.error = "Failed to fetch problems.";
    // });

    $scope.sections = Sections.onSections.list();
//    $scope.sections = Sections.onSections.
    //$scope.sections = {}

    $scope.hahahaha = Units.onUnits.get({uuid: "d1"});
    $scope.haha = Sections.onUnits.get({uuid: "g1"});
    $scope.createNewSection = function(){
        $scope.newSection.sectionUUID = "new";
        $scope.newSection.sectionUnits = [];
        Sections.onSections.save($scope.newSection);
        $scope.list.push($scope.newSection);
    };
}]);

//ProblemCtrl.$inject = ['$scope', '$http'];


//function PhoneDetailCtrl($scope, $routeParams) {
//    $scope.phoneId = $routeParams.phoneId;
//}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams'];