'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('NavbarCtrl',
        ['$routeParams', '$location', '$filter', '$rootScope', '$scope', '$modal', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
            function ($routeParams, $location, $filter, $rootScope, $scope, $modal, Auth, Sections, Units, Materials, Students, Model) {
                //Boiler Plate for authentication info
                $scope.user = Auth.user;
                $scope.userRoles = Auth.userRoles;
                $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.


                $scope.modal = {title: 'Title', content: 'Hello Modal<br />This is a multiline message!'};


            }
        ]
    );
