'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('BookEditCtrl',
    ['$routeParams', '$location', '$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
        function ($routeParams, $location, $filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
            //Boiler Plate for authentication info
            $scope.user = Auth.user;
            $scope.userRoles = Auth.userRoles;
            $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

            $rootScope.errors = {};
            $scope.Model = Model;
            $scope.view = {
                modalState: 'list', // list, search, create
                books: []
            };


            console.log($location.url());

            if ($routeParams.sessionId) {
                Model.getSession($routeParams.sessionId);
                $scope.view.books = Model.session.books;
                $scope.view.removeBook = Model.session.removeBook;
            } else if ($routeParams.username) {
                Model.getUser($routeParams.username);
                $scope.view.books = Model.profile.books;
            } else if ($location.url() == '/home') {
                /**
                 * list of view handles:
                 * - view.books: list of books belong to the session etc.
                 * - view.addBook(book): add book event hook
                 * - view.removeBook(book): remove book event hook
                 */
                Model.getBooks();
                console.log(Model.profile);
                $scope.view.books = Model.profile.books;

                $scope.view.addBook = function (book, index) {
                    function success(books) {
                        if (index !== undefined) {
                            console.log('success!!');
                            Model.books[index].selected = true;
                        }
                        $scope.view.books = Model.profile.books;
                    };
                    Model.profile.addBook(book, success);
                };
                $scope.view.removeBook = function (book, index) {
                    function success(books) {
                        if (index !== undefined) {
                            Model.books[index].selected = false;
                        }
                        $scope.view.books = Model.profile.books;
                    };
                    Model.profile.removeBook(book, success);
                };
            }

        }
    ]);
