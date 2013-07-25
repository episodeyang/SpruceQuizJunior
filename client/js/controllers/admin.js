'use strict';

/* Controllers */

var app = angular.module('SpruceQuizApp');


app.controller('AdminCtrl',
['$rootScope', '$scope', 'Students', function($rootScope, $scope, Students) {

    $scope.loading = false;
    $scope.students = Students.onStudents.list();
    $scope.isCollapsed = false;

}]);

