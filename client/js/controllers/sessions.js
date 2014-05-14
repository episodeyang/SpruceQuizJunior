'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('SessionCtrl',
        ['$routeParams', '$location', '$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
            function ($routeParams, $location, $filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
                //Boiler Plate for authentication info
                $scope.user = Auth.user;
                $scope.userRoles = Auth.userRoles;
                $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

                if ( window.location.host.indexOf('youzi') == 0) {
                    $scope.orgTitle = "游子 - ";
                }
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
                        flipped: false
                    }
                };
                $rootScope.errors = {};

                if ($routeParams.sessionId) {
                    Model.getSession($routeParams.sessionId);
                }

                $scope.addTeacher = function (index) {
                    console.log(index);
//                    Model.session.save();
                };
            }
        ]);
