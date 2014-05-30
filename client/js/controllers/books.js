'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('BookCtrl',
    ['$routeParams', '$location', '$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
        function ($routeParams, $location, $filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
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

            $scope.view = {
                state: 'newsFeed',
                card: {
                    edit: false,
                    flipped: false
                }
            };
            $rootScope.errors = {};


            Model.getBook(
                $routeParams.bookId,
                $routeParams.bookTitle,
                $routeParams.authorName
            ).then(function () {
                    Model.getBookFeeds()
                        .then(function () {
                            $scope.view.feedBucket = Model.bookFeeds;
                        });
                });

//            $scope.submitBook = Model.book.save;
            function isArray(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }

            $scope.editBook = function () {
                $scope.view.card.edit = true;
                function removeNullAddEmptyToEnd(obj, key) {
                    if (isArray(obj) && key !== 'authors') {
                        obj.map(function (value, index) {
                            if (!value) {
                                obj.splice(index, 1);
                            }
                        });
                        obj.push('');
                    } else if (key === 'authors') {
                        obj.push({name: ''});
                    }
                }

                _.map(Model.book, removeNullAddEmptyToEnd);
            };

            var changed = false;
            $scope.$watch('Model.book',
                function (newVal, oldVal) {
                    if (newVal.title != oldVal.title) {
                        changed = true;
                    }
                },
                true);

            $scope.submitBook = function () {

                function removeNull(obj, key) {
                    if (isArray(obj)) {
                        obj.map(function (value, index) {
                            if (!value) {
                                obj.splice(index, 1);
                            }
                        });
                    }
                }

                _.map(Model.book, removeNull);
                Model.book.authors = Model.book.authors.filter(
                    function (value) {
                        return value.name.length != 0;
                    }
                );
                Model.book.save(
                    function () {
                        $scope.view.card.edit = false;
                        if (changed === true) {
                            $location.path('/books/id/' + Model.book._id);
                            return $scope.$apply();
                        }
                    },
                    function (error) {
                    });
            };
        }
    ]);
