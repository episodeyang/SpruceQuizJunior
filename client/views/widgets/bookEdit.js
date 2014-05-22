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
                state: 'list', // list, search, create
                books: []
            };

            if ($routeParams.sessionId) {
                Model.getSession($routeParams.sessionId);
                $scope.view.books = Model.session.books;
                $scope.view.removeBook = Model.session.removeBook;
            } else if ($routeParams.username) {
                Model.getUser($routeParams.username);
                $scope.view.books = Model.profile.books;
            }



        }
    ]);
