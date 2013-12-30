angular.module('SpruceQuizApp')
    .controller('FrontPageCtrl',
        ['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

            $scope.viewCtrl = {};
            $scope.viewCtrl.showLoginForm = false;
            $scope.loginForm = {};

            $scope.exitLogin = function(){
                $scope.viewCtrl.showLoginForm = false;
            };

            $scope.rememberme = true;
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

            $scope.viewCtrl.showRegisterForm = false;
            $scope.registerForm = {};
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
                if (len == 4 || len == 7){return rawString+"/"; console.log('fit the length')}
                else if (len>=11){ return rawString.substring(0,10);}
                else {return rawString;}
            };

            $scope.$watch('registerForm.birthDayString', function(newValue, oldValue){
                "use strict";
                console.log('updating the string');
                console.log(newValue+'||'+ oldValue);
                $scope.registerForm.birthDayString = dateFormater(newValue);
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
                            role: $scope.registerForm.role
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

