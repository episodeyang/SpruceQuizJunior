'use strict';

var spApp = angular.module('SpruceQuizApp');

spApp.controller('TeacherCtrl',
    ['$rootScope', '$scope', 'Auth', 'Model', 'Students',
        function ($rootScope, $scope, Auth, Model, Students) {
            //Boiler Plate for authentication info
            $scope.user = Auth.user;
            $scope.userRoles = Auth.userRoles;
            $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

            if (window.location.host.indexOf('youzi') == 0) {
                $scope.orgTitle = "游子 - ";
            }
            $scope.debug = {
                alert: function () {
                    alert('konami code success');
                }
            };
            $rootScope.errorClear = function () {
                $rootScope.error = null;
            };
            $scope.Model = Model;
            $scope.searchStudents = function(schoolName) {
                var query = {};
                if (schoolName) {
                    query.school = schoolName;
                }
                console.log(query);
                Students.search(query).$promise.then(function(students){
                    console.log(students);
                    $scope.students = students;
                }).catch(function(error){
                    console.log("error:", error);
                })
            }
        }
    ]);
