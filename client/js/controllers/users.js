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

//                $scope.profile = {
//                    name: "张小明",
//                    username: "student",
//                    signature: "数理小超人",
//                    DOB: new Date(),
//                    addresses: [],
//                    schools: [
//                        {   name: "北京四中",
//                            classYear: 2015,
//                            type: 'middleSchool',
//                            entrance: 2012,
//                            left: 2015,
//                            alumnus: true,
//                            alumni: true
//                        },
//                        {   name: "人民大学附属中学",
//                            classYear: 2018,
//                            type: 'highSchool',
//                            entrance: 2015,
//                            left: null,
//                            alumnus: null,
//                            alumni: true
//                        },
//                        {   name: "清华大学",
//                            classYear: 2022,
//                            type: 'college',
//                            entrance: 2018,
//                            left: null,
//                            alumnus: null,
//                            alumni: true,
//                            majors: ['计算机']
//                        }
//                    ],
//                    strongSubjects: ['数学'],
//                    majors: [''],
//                    extracurriculars: ["数学奥林匹克竞赛"],
//                    questions: [],
//                    questionCount: 24,
//                    answers: [],
//                    answerCount: 32,
//                    edits: [],
//                    editCount: 56
//                };

                Model.getUserProfile($routeParams.username);
                $scope.profile = Model.profile;
            }
        ]);
