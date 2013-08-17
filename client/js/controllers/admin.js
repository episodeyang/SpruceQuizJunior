'use strict';

/* Controllers */

var app = angular.module('SpruceQuizApp');

app.factory('newStudentList', function(){
    return [];
});

app.controller('AdminCtrl',
['$rootScope', '$scope', 'Students', 'Schools', 'Sections', 'Teachers', 'newStudentList', function($rootScope, $scope, Students, Schools, Sections, Teachers, newStudentList) {
    $scope.loading = false;
    $scope.students = Students.onStudents.list();
    $scope.schools = Schools.onSchools.list();
    $scope.teachers = Teachers.onTeachers.list();
    $scope.sections = Sections.onSections.list();
    $scope.isCollapsed = false;
    $scope.newStudentList = newStudentList;
    $scope.deleteNewStudent = function(){
        $scope.isCollapsed = true;
        $scope.newStudentList = [];
    };
}]);



var CreateModalCtrl = function($scope,Students,newStudentList) {
    $scope.newStudentList = newStudentList;
    $scope.newStudent={};
    $scope.opts = {
        backdropFade: true,
        dialogFade:true
    };
    $scope.createStudentModal = false;
    $scope.addStudent = function(stu) {
        //    console.log(angular.toJson(stu));
        Students.onStudents.save(stu);
        $scope.newStudentList.push(stu);
        $scope.$parent.students = Students.onStudents.list();
        $scope.close();
    }
    $scope.close=function(){
        console.log($scope);
        $scope.createStudentModal = false;
    }

}

var EditModalCtrl = function($scope,$q,$timeout,Students) {
    $scope.opts = {
        backdropFade: true,
        dialogFade:true
    };
    $scope.editStudentModal = false;
    $scope.editStudent = function(stu) {
        delete stu.__v;
        delete stu._id;
    //  console.log(angular.toJson(stu));
        Students.onStudents.update(stu);
        $scope.close();

    }
    $scope.deleteStudent = function(stu) {
        //   console.log(angular.toJson(stu));
        $scope.close();
        Students.onStudents.remove({uuid:stu.userUUID})
        var updateParent = $q.defer();
        updateParent.promise
            .then(function(){
             $scope.$parent.$parent.students = Students.onStudents.list()
            });

        $timeout(function(){
            updateParent.resolve();
        },100);
    };
    $scope.close=function(){
        console.log($scope);
        $scope.editStudentModal = false;
        return true;
    }

}
