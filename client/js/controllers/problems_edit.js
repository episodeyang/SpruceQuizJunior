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
    $scope.viewVariables.probIndex = -1;
    $scope.orderProp = 'lastupdated';

    $scope.editProblemInit = function(index) {
        $scope.viewVariables.editProblemModal = true;
        $scope.viewVariables.editingProb = $scope.problems[index];
        $scope.viewVariables.probIndex = index;
        $scope.viewVariables.choicesArr = _.map($scope.viewVariables.editingProb.choices, function(choice){ return { str: choice} ; });
        $scope.viewVariables.questionArr = _.map($scope.viewVariables.editingProb.question, function(segment){ return { str: segment} ; });
        //console.log($scope.viewVariables.choicesArr);
        //$scope.viewVariables.index = index;
        //console.log("print test");
    };

    $scope.saveEditing = function() {
        $scope.viewVariables.editingProb.choices = _.map($scope.viewVariables.choicesArr, function(choice){ return choice.str; });
        $scope.viewVariables.editingProb.question = _.map($scope.viewVariables.questionArr, function(segment){ return segment.str; });
        console.log($scope.viewVariables.editingProb);
        $scope.problems[$scope.viewVariables.probIndex] = $scope.viewVariables.editingProb;
        Problems.onProblems.update($scope.viewVariables.editingProb);
        $scope.viewVariables.editProblemModal = false;
    };

    $scope.cancelEditing = function() {
        $scope.viewVariables.choicesArr = [];
        $scope.viewVariables.questionArr = [];
        $scope.viewVariables.editingProb = {};
        $scope.viewVariables.probIndex = -1;
        $scope.viewVariables.editProblemModal = false;
    };

}]);

//ProblemCtrl.$inject = ['$scope', '$http'];


//function PhoneDetailCtrl($scope, $routeParams) {
//    $scope.phoneId = $routeParams.phoneId;
//}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams'];