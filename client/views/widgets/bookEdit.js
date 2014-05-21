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

            $scope.Model = Model;

            $scope.view = {
                state: 'list'
            };
            $rootScope.errors = {};

            if ($routeParams.sessionId) {
                Model.getSession($routeParams.sessionId);
            }


        }
    ]);
