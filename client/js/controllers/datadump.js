'use strict';
angular.module('SpruceQuizApp')
    .controller('DatadumpCtrl',
        ['$rootScope', '$scope', 'Sections', 'Units', 'Materials', 'Students',
            function ($rootScope, $scope, Sections, Units, Materials, Students) {

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

                $scope.model = {};
                $scope.listStudents = function () {
                    Students.onStudents.list(function(results){
                        $scope.model.studentList = groupToPages(results);
                        console.log("direct results are:");
                        console.log(results);
                        console.log("processed data is:");
                        console.log($scope.model.studentList.toString());
                    });
                };
            }
        ]);

