'use strict';
'use utf-8';
/* Controllers */

angular.module('SpruceQuizApp')
.controller('AppCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {

    $rootScope.getUserRoleText = function(role) {
        return _.invert(Auth.userRoles)[role];
    };
    $rootScope.logout = function() {
        Auth.logout(function() {
            $location.path('/public/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('SpruceQuizApp')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.viewCtrl = {};
    $scope.viewCtrl.showLoginForm = false;
    $scope.viewCtrl.showRegisterForm = false;
    console.log('success in updating the variables')
    $scope.form = {};
    $scope.form.userName = "";
    $scope.form.password = "";
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
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };

}]);

angular.module('SpruceQuizApp')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = rolesHelper.userRoles.user;
    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role
            },
            function(res) {
                $rootScope.user = res;
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

angular.module('SpruceQuizApp')
.controller('PrivateCtrl',
['$rootScope', function($rootScope) {
}]);


angular.module('SpruceQuizApp')
.controller('UserAdminCtrl',
['$rootScope', '$scope', 'Users', function($rootScope, $scope, Users) {
    $scope.loading = true;

    Users.getAll(function(res) {
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });

}]);


