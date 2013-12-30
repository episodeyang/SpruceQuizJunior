angular.module('SpruceQuizApp')
    .controller('FrontPageCtrl',
        ['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

            $scope.viewCtrl = {};
            $scope.viewCtrl.showLoginForm = false;
            $scope.viewCtrl.showRegisterForm = false;
            console.log('success in updating the variables')
            $scope.loginForm = {};
            $scope.registerForm = {};

            $scope.exitLogin = function(){
                $scope.viewCtrl.showLoginForm = false;
            };
            $scope.exitRegister = function(){
                $scope.viewCtrl.showRegisterForm = false;
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

