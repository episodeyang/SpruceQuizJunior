'use strict';

var spApp = angular.module('SpruceQuizApp');

spApp.controller('SuperAdminCtrl',
    ['$scope', 'Students',//'$rootScope', '$scope', 'Sections', 'Units', 'Materials', 'Students',
        function ($scope, Students) {//$rootScope, $scope, Sections, Units, Materials, Students) {
            // this object is to hold data for future tables
            $scope.data = {}; // initialized here and updated later when things are clicked.
            $scope.studentShowClicked = false;
            var itemsPerPage = 10;
            $scope.pageStatus = {};
            $scope.pageStatus.currentPage = 0;
            //$scope.student = "student";

            // helper function: calculate page
            // takes in the list and returns a processed list of lists.
            var groupToPages = function (items) {
                var pagedItems = [];

                for (var i = 0; i < items.length; i++) {

                    if (i % itemsPerPage === 0) {
                        pagedItems[Math.floor(i / itemsPerPage)] = [ items[i] ];
                    } else {
                        pagedItems[Math.floor(i / itemsPerPage)].push(items[i]);
                    }
                }

                return pagedItems;
            };

            $scope.range = function (start, end) {
                var ret = [];
                if (!end) {
                    end = start;
                    start = 0;
                }
                for (var i = start; i < end; i++) {
                    ret.push(i);
                }
                return ret;
            };

            $scope.prevPage = function () {
                if ($scope.currentPage > 0) {
                    $scope.currentPage--;
                }
            };

            $scope.nextPage = function () {
                if ($scope.currentPage < $scope.pagedItems.length - 1) {
                    $scope.currentPage++;
                }
            };

            $scope.setPage = function () {
                $scope.currentPage = this.n;
            };

            //$scope.listStudents = function () {
            $scope.studentShowClicked = true;
            $scope.data['student'] = {};
            Students.onStudents.list(function (results) {
                // the controller gets the data and puts in the correct data structure
                $scope.data['student'].header = [
                    {value: 'firstName', name: 'First Name'},
                    {value: 'lastName', name: 'Last Name'},
                    {value: 'dateOfBirth', name: 'DoB'},
                    {value: 'gender', name: 'Gender'},
                    {value: 'schools', name: 'Schools'},
                    {value: 'sections', name: 'Sections'},
                    {value: 'phone', name: 'Phone'}
                ];

                $scope.data['student'].data = groupToPages(results);
                console.log("logging from controller:");
                console.log($scope.data['student'].data);
            });
            //};
        }
    ]
);

