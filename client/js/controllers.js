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
            $location.path('/frontPage');
        }, function() {
            $rootScope.error = "Failed to logout";
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


