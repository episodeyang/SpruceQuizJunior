'use strict';

/* Controllers */

var app = angular.module('SpruceQuizApp');


app.controller('AdminCtrl',
['$rootScope', '$scope', 'Students', 'Teachers', 'Schools', function($rootScope, $scope, Students, Teachers, Schools) {

    $scope.loading = false;
    $scope.students = Students.onStudents.list();
    $scope.teachers = Teachers.onTeachers.list();
    $scope.schools = Schools.onSchools.list();
    $scope.isCollapsed = false;

}]);

