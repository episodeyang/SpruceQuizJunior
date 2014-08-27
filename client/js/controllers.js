'use strict';
'use utf-8';
/* Controllers */

angular.module('SpruceQuizApp')
.controller('AppCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $rootScope.getUserRoleText = function(role) {
        return _.invert(Auth.userRoles)[role];
    };
    $rootScope.logout = function() {
        Auth.logout(function() {
            $location.path('/');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);
