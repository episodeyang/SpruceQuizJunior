angular.module('SpruceQuizApp')
    .controller('FrontPageCtrl',
        ['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

            $scope.viewCtrl = {};
            $scope.viewCtrl.showLoginForm = false;
            $scope.loginForm = {};

            $scope.exitLogin = function(){
                $scope.viewCtrl.showLoginForm = false;
            };

            $scope.loginForm.rememberMe = true;
            $scope.login = function() {
                Auth.login({
                        username: $scope.loginForm.userName,
                        password: $scope.loginForm.password,
                        rememberme: $scope.loginForm.rememberMe
                    },
                    function(res) {
                        $location.path('/');
                    },
                    function(err) {
                        $rootScope.errors.login = "Failed to login";
                    });
            };

            $scope.loginOauth = function(provider) {
                $window.location.href = '/auth/' + provider;
            };


            // Registration Form ====================
            $scope.viewCtrl.showRegistForm = false;
            $scope.userRoles = Auth.userRoles;
            $scope.registForm = {
                username: '',
                email: '',
                schoolName: '',
                password: '',
                role: {},
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: ''
            };
            $scope.exitRegister = function(){
                $scope.viewCtrl.showRegistForm = false;
            };

            dateFormater = function(rawString){
                "use strict";
                var len = 0;
                if (rawString){
                    len = rawString.length;
                    console.log(len);
                    console.log('show the length')
                } else {rawString = ''}
                if (len == 5 || len == 8){
                    if (rawString.substring(len-1,len)!='-'){return rawString.substring(0, len-1)+"-"+rawString.substring(len-1, len); console.log('fit the length')}
                    else {return rawString.substring(0, len-1);}
                }
                else if (len>=11){ return rawString.substring(0,10);}
                else {return rawString;}
            };

            $scope.$watch('registForm.birthDayString', function(newValue, oldValue){
                $scope.registForm.birthDayString = dateFormater(newValue);
                $scope.registForm.dateOfBirth = new Date($scope.registForm.birthDayString.split('_'))
            })
            $scope.$watch('registForm.nameRawText', function(newValue, oldValue){
                $scope.registForm.birthDayString = dateFormater(newValue);
                $scope.registForm.dateOfBirth = new Date($scope.registForm.birthDayString.split('_'))
            })

            $scope.role = rolesHelper.userRoles.user;
            $rootScope.errors = {};
            $scope.register = function() {
                if ($scope.registForm.password !== $scope.registForm.passwordConfirm){
                    $rootScope.errors.password = '两次密码输入不相符。请再次输入密码。';
                    console.log($rootScope.errors);
                }
                if ($scope.registForm.role == null ){
                    $rootScope.errors.role = '请定义用户身份。';
                    console.log($rootScope.errors);
                } else {
                    $scope.registForm.role = Auth.userRoles[$scope.registForm.role];
                };
                if (!$rootScope.err){
                    console.log('sending registration data to /regist')
                    Auth.register({
                            username: $scope.registForm.username,
                            password: $scope.registForm.password,
                            role: $scope.registForm.role,
                            params: {
                                email: $scope.registForm.email,
                                schoolName: $scope.registForm.schoolName,
                                firstName: $scope.registForm.firstName,
                                lastName: $scope.registForm.lastName,
                                dateOfBirth: $scope.registForm.dateOfBirth,
                                gender: 'male'
                            }
                        },
                        function(res) {
                            console.log('now move to path "/"')
                            $location.path('/');
                        },
                        function(err) {
                            $rootScope.errors.server= err;
                        }
                    );
                }
            };

        }]);

