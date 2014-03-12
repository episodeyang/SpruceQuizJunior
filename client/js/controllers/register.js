'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('RegisterCtrl',
        ['$routeParams', '$location', '$filter', '$rootScope', '$scope', '$modal', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
            function ($routeParams, $location, $filter, $rootScope, $scope, $modal, Auth, Sections, Units, Materials, Students, Model) {
                //Boiler Plate for authentication info
                $scope.user = Auth.user;
                $scope.userRoles = Auth.userRoles;
                $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

                $scope.roleList = [{
                    title : "学生",
                    value : Auth.userRoles.student
                    },{
                    title : "老师",
                    value : Auth.userRoles.teacher
                    },{
                    title : "家长",
                    value : Auth.userRoles.parent
                    }
                ]
                $scope.registerData = {
                }

                $scope.submit = function () {
                    var that = this;
                    Auth.register(
                        $scope.loginData,
                        function(res) {
                            Model.init();
                            Model.queryQuestions();
                            that.$hide();
                        },
                        function(err) {
                            $rootScope.errors.login = "Failed to login";
                        });

                }
            }
        ]
    );
