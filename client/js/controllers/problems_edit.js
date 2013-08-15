'use strict';

/* Controllers */

angular.module('SpruceQuizApp')
.controller('ProblemEditCtrl',
['$rootScope', '$scope', 'Problems', function($rootScope, $scope, Problems) {
    $scope.expression = "\\( \\frac{5}{4} \\div \\frac{1}{6} \\)";
    $scope.highlightField = "question";

    $scope.problemTypes = ['multipleChoice','fillIn','OpenEnded'];

    //Use the next two lines if accessing a specific problem with a uuid
    //$scope.problems = [];
    //$scope.problems.push(Problems.get({uuid: "p0001"}));

    //Use the next line to get all problems
    $scope.problems = Problems.onProblems.list();
    $scope.viewVariables = {};
    $scope.viewVariables.editProblemModal = false;
    $scope.orderProp = 'lastupdated';
}]);

//ProblemCtrl.$inject = ['$scope', '$http'];


//function PhoneDetailCtrl($scope, $routeParams) {
//    $scope.phoneId = $routeParams.phoneId;
//}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams'];