'use strict';

/* Controllers */

var app = angular.module('SpruceQuizApp');

app.factory('newStudentList', function(){
    return [];
});

app.controller('AdminCtrl',
['$rootScope', '$scope', 'Students', 'newStudentList', function($rootScope, $scope, Students,newStudentList) {
    $scope.loading = false;
    $scope.students = Students.onStudents.list();
    $scope.isCollapsed = false;
    $scope.newStudentList = newStudentList;
    $scope.deleteNewStudent = function(){
        $scope.isCollapsed = true;
        $scope.newStudentList = [];
    }

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
        $scope.close();
    }
    $scope.close=function(){
        console.log($scope);
        $scope.createStudentModal = false;
    }
}

var EditModalCtrl = function($scope,Students) {
    $scope.opts = {
        backdropFade: true,
        dialogFade:true
    };
    $scope.editStudentModal = false;
    $scope.editStudent = function(stu) {
        this.newStu = {};
        this.newStu.userUUID = stu.userUUID;
        this.newStu.firstName = stu.firstName;
        this.newStu.lastName = stu.lastName;
        this.newStu.dateOfBirth = stu.dateOfBirth;
        this.newStu.sex = stu.sex;
        this.newStu.email = stu.email;
        this.newStu.phone = stu.phone;
        this.newStu.address = stu.address;
        this.newStu.profilePic = stu.profilePic;
        this.newStu.sections = stu.sections;
        this.newStu.schools = stu.schools;
        this.newStu.comments = stu.comments;
        //  console.log(angular.toJson(this.newStu));
        //  Students.onStudents.update(this.newStu);
        $scope.close();
    }
    $scope.deleteStudent = function(stu) {
        //   console.log(angular.toJson(stu));
        Students.onStudents.remove({uuid:stu.userUUID});
        $scope.close();
    }
    $scope.close=function(){
        console.log($scope);
        $scope.editStudentModal = false;
    }
}