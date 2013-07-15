'use strict';

/* Controllers */

angular.module('SpruceQuizApp')
.controller('ProblemCtrl',
['$rootScope', '$scope', 'Problems', function($rootScope, $scope, Problems) {
//function ProblemCtrl($scope, Problems) 
    //$rootScope.error = "Temp warning";
    $scope.expression = "\\( \\frac{5}{4} \\div \\frac{1}{6} \\)";
    $scope.highlightField = "question";

    $scope.problemTypes = ['multipleChoice','fillIn','OpenEnded'];

    //Use the next two lines if accessing a specific problem with a uuid
    //$scope.problems = [];
    //$scope.problems.push(Problems.get({uuid: "d0001"}));

    //Use the next line to get all problems
    $scope.problems = Problems.list();

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
    $scope.orderProp = 'lastupdated';
}]);

//ProblemCtrl.$inject = ['$scope', '$http'];


//function PhoneDetailCtrl($scope, $routeParams) {
//    $scope.phoneId = $routeParams.phoneId;
//}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams'];