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

                if ( window.location.host.indexOf('youzi') == 0) {
                    $scope.orgTitle = "游子 - ";
                };
                $scope.debug= {
                    alert: function(){
                        alert('konami code success');
                    }
                };
                $rootScope.errorClear = function(){
                    $rootScope.error = null;
                };
                $scope.Model = Model;

                $scope.view = {
                    state: 'search',
                    card: {
                        edit: false,
                        flipped: false
                    }
                };
                console.log($scope.view);
                $rootScope.errors = {};

                if ($routeParams.bookId) {
                    Model.getBook($routeParams.bookId, null, null);
                } else if ($routeParams.title && !$routeParams.authorName) {
                    Model.getBook(null,  $routeParams.title);
                } else if ($routeParams.title && $routeParams.authorName) {
                    Model.getBook(null,  $routeParams.title, $routeParams.authorName);
                }

                $scope.submitBook = Model.book.save;
                function isArray(obj) {
                    return Object.prototype.toString.call(obj) === '[object Array]';
                }
                $scope.editBook = function () {
                    $scope.view.card.edit = true;

                    console.log($scope.view.card.edit);

                    function removeNullAddEmptyToEnd(obj, key) {
                        if (isArray(obj) && key !== 'schoolRecord') {
                            obj.map(function (value, index) {
                                if (!value) {
                                    obj.splice(index, 1);
                                }
                            });
                            obj.push('');
                        }
                    }
                    _.map(Model.book, removeNullAddEmptyToEnd);


                };

                var changed = false;
                $scope.$watch('Model.book',
                    function (newVal, oldVal) {
                        if (newVal.title != oldVal.title) {changed = true;}
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

                    Model.book.save(
                        function () {
                            $scope.view.card.edit = false;
                            if (changed === true) {
                                $location.path('/books/'+ Model.book.authors[0] + '/' + Model.book.title);
                                $scope.$apply()
                            }
                        },
                        function (error) {
                        });
                };
            }
        ]);
