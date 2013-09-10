'use strict';

var spApp = angular.module('SpruceQuizApp');

spApp.controller('SuperAdminCtrl',
    ['$scope', 'Students',//'$rootScope', '$scope', 'Sections', 'Units', 'Materials', 'Students',
        function ($scope, Students) {//$rootScope, $scope, Sections, Units, Materials, Students) {
            // this object is to hold data for future tables
            $scope.data = {}; // initialized here and updated later when things are clicked.
            $scope.studentShowClicked = false;
            var itemsPerPage = 10;
            $scope.currentPage = 0;

            // helper function: calculate page
            // takes in the list and returns a processed list of lists.
            var groupToPages = function (items) {
                var pagedItems = [];

                console.log(items.length);
                for (var i = 0; i < items.length; i++) {

                    if (i % itemsPerPage === 0) {
                        pagedItems[Math.floor(i / itemsPerPage)] = [ items[i] ];
                    } else {
                        pagedItems[Math.floor(i / itemsPerPage)].push(items[i]);
                    }
                }

                console.log(pagedItems);
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

//                $scope.testVal = [
//                    {value: 'name', name: 'Name'},
//                    {value: 'dateOfBirth', name: 'DoB'},
//                    {value: 'gender', name: 'Gender'},
//                    {value: 'schools', name: 'Schools'},
//                    {value: 'sections', name: 'Sections'},
//                    {value: 'phone', name: 'Phone'}
//                ];

            $scope.listStudents = function () {
                $scope.studentShowClicked = true;
                $scope.data['student'] = {};
                Students.onStudents.list(function (results) {
                    // the controller gets the data and puts in the correct data structure
                    $scope.testVal = [
                        {value: 'name', name: 'Name'},
                        {value: 'dateOfBirth', name: 'DoB'},
                        {value: 'gender', name: 'Gender'},
                        {value: 'schools', name: 'Schools'},
                        {value: 'sections', name: 'Sections'},
                        {value: 'phone', name: 'Phone'}
                    ];
                    $scope.data['student'].header = [
                        {value: 'name', name: 'Name'},
                        {value: 'dateOfBirth', name: 'DoB'},
                        {value: 'gender', name: 'Gender'},
                        {value: 'schools', name: 'Schools'},
                        {value: 'sections', name: 'Sections'},
                        {value: 'phone', name: 'Phone'}
                    ];
                    $scope.data['student'].data = groupToPages(results);
                    //$scope.model.studentList =
                    console.log("direct results are:");
                    console.log(results);
                });
            };
        }
    ]
);

//spApp.controller('SuperAdminCtrl',
//    ['$scope', 'Students',//'$rootScope', '$scope', 'Sections', 'Units', 'Materials', 'Students',
//        function ($scope, Students) {
//        }
//    ]
//);
