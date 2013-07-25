'use strict';

/* Controllers */

var app = angular.module('SpruceQuizApp');
app.filter('first',function(){
    return function(list){
        return list;
    }
});

app.controller('StudentAdminCtrl',
        ['$rootScope', '$scope', 'Students', function($rootScope, $scope, Students) {
            $scope.loading = false;
            $scope.students = Students.onStudents.list();
        }]);

