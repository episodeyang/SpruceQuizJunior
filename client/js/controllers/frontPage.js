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
            $scope.viewCtrl.showRegisterForm = false;
            $scope.registerForm = {
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
                $scope.viewCtrl.showRegisterForm = false;
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

            $scope.$watch('registerForm.birthDayString', function(newValue, oldValue){
                $scope.registerForm.birthDayString = dateFormater(newValue);
                $scope.registerForm.dateOfBirth = new Date($scope.registerForm.birthDayString.split('_'))
            })
            $scope.$watch('registerForm.nameRawText', function(newValue, oldValue){
                $scope.registerForm.birthDayString = dateFormater(newValue);
                $scope.registerForm.dateOfBirth = new Date($scope.registerForm.birthDayString.split('_'))
            })

            $scope.role = rolesHelper.userRoles.user;
            $rootScope.errors = {};
            $scope.register = function() {
                if ($scope.registerForm.password !== $scope.registerForm.passwordConfirm){
                    $rootScope.errors.password = '两次密码输入不相符。请再次输入密码。';
                    console.log($rootScope.errors);
                }
                if ($scope.registerForm.role == null ){
                    $rootScope.errors.role = '请定义用户身份。';
                    console.log($rootScope.errors);
                }
                if (!$rootScope.err){
                    console.log('sending registration data to /regist')
                    Auth.register({
                            username: $scope.registerForm.username,
                            password: $scope.registerForm.password,
                            role: $scope.registerForm.role,
                            params: {
                                email: $scope.registerForm.email,
                                schoolName: $scope.registerForm.schoolName,
                                firstName: $scope.registerForm.firstName,
                                lastName: $scope.registerForm.lastName,
                                dateOfBirth: $scope.registerForm.dateOfBirth,
                                gender: 'male'
                            }
                        },
                        function(res) {
                            $rootScope.user = res;
                            $location.path('/');
                        },
                        function(err) {
                            $rootScope.errors.server= err;
                        }
                    );
                }
            };

        }]);

