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
                state: 'search',
                profile: {}
            };
            $scope.view.profile.edit = false;

            $rootScope.errors = {};


            Model.getUserProfile($routeParams.username);

            function isArray(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }

            $scope.editProfile = function () {

                $scope.view.profile.edit = true;

                function removeNullAddEmptyToEnd(obj) {
                    if (isArray(obj)) {
                        obj.filter(function () {return true});
                        obj.push('');
                    }
                }

                _.map(Model.profile, removeNullAddEmptyToEnd);

                if (Model.profile.schoolRecord[Model.profile.schoolRecord.length-1]==='') {
                    Model.profile.schoolRecord[Model.profile.schoolRecord.length-1]={
                        name: '',
                        classYear: null,
                        entrance: null,
                        left: null,
                        alumni: null,
                        type: '',
                        majors: ['']
                    }
                } else {
                    Model.profile.schoolRecord[Model.profile.schoolRecord.length-1].majors.push('');
                }

                console.log(Model.profile);
            };

            $scope.submitProfile = function () {

                var school = Model.profile.schoolRecord[Model.profile.schoolRecord.length-1]

                function removeNull(obj, key) {
                    if (isArray(obj)) {
                        obj.filter(function () {return true});
                    }
                }
                _.map(Model.profile, removeNull);
                console.log(school.name)
                if (school.name=='') {
                    console.log('removing the last schoolRecord')
                    Model.profile.schoolRecord.splice(-1);
                }

                console.log('now user profile is ready to submit')
                console.log(Model.profile)
                $scope.view.profile.edit = false;
            };
        }
    ]);
