'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('UserCtrl',
    ['_', '$routeParams', '$location', '$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
        function (_, $routeParams, $location, $filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
            //Boiler Plate for authentication info
            $scope.user = Auth.user;
            $scope.userRoles = Auth.userRoles;
            $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

            if (window.location.host.indexOf('youzi') == 0) {
                $scope.orgTitle = "游子 - ";
            }
            ;
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
                state: 'timeline',
                modalState: 'mySessions',
                profile: {}
            };

            $scope.view.profile.edit = false;

            $rootScope.errors = {};

            Model.getUserProfile($routeParams.username);
            Model.getUserFeeds($routeParams.username);
            $scope.feedBucket = Model.userFeed;

            $scope.$watch('view.state', function (newVal, oldVal) {
                var query = {};
                if (newVal == 'questions') {
                    query.authorUsername = Model.profile.username;
                    Model.searchQuestions(query);
                } else if (newVal == 'answers') {
                    query.answerAuthorUsername =  Model.profile.username;
                    Model.searchQuestions(query);
                }
            })
        }
    ]);
