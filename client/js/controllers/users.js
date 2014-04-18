'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('UserCtrl',
        ['$routeParams', '$location', '$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
            function ($routeParams, $location, $filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
                //Boiler Plate for authentication info
                $scope.user = Auth.user;
                $scope.userRoles = Auth.userRoles;
                $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

                if ( window.location.host.indexOf('youzi') == 0) {
                    $scope.orgTitle = "游子 - ";
                };
                $scope.debug = {
                    alert: function () {
                        alert('konami code success');
                    }
                };
                $rootScope.errorClear = function(){
                    $rootScope.error = null;
                };
                $scope.Model = Model;

                $scope.view = {
                    state: 'search',
                    profile: {}
                };
                $scope.view.profile.edit = false;

                $rootScope.errors = {};

                $scope.profile = {
                    name: "张小明",
                    username: "student",
                    signature: "数理小超人",
                    schools: [
                        {   name: "北京四中",
                            classYear: 2015,
                            type: 'middleSchool',
                            majors: ['数学'],
                            extracurriculars: ["数学奥林匹克竞赛"],
                            alumni: true
                        }
                    ],
                    questions: [],
                    questionCount: 24,
                    answers: [],
                    answerCount: 32,
                    edits: [],
                    editCount: 56
                };

                if ($routeParams.username) {
                }
            }
        ]);
