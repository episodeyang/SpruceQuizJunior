'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('LoginCtrl',
        ['$routeParams', '$location', '$filter', '$rootScope', '$scope', '$timeout', '$modal', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
            function ($routeParams, $location, $filter, $rootScope, $scope, $timeout, $modal, Auth, Sections, Units, Materials, Students, Model) {
                //Boiler Plate for authentication info
                $scope.user = Auth.user;
                $scope.userRoles = Auth.userRoles;
                $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

                $scope.view = {}
                $scope.loginData = {
                    username: '',
                    password: ''
                }

                $scope.view.clearErrors =
                    function () {
                        $scope.view.error = undefined;
                    }
                $scope.submit = function () {
                    var that = this;
                    Auth.login(
                        $scope.loginData,
                        function (res) {
                            Model.init();
                            Model.queryQuestions();
                            that.$hide();
                        },
                        function (err) {
                            $rootScope.errors.login = "Failed to login";
                            $scope.view.error = "登陆有错，请重新输入用户名和密码。";
                            $timeout(
                                $scope.view.clearErrors
                                , 3000);
                        });

                }
            }
        ]
    );
