/**
 * Created with JetBrains WebStorm.
 * User: ge
 * Date: 10/22/13
 * Time: 10:20 PM
 * To change this template use File | Settings | File Templates.
 */

'user strict';
angular.module('SpruceQuizApp')
    .controller('LoginPageCtrl',['$rootScope', '$scope', function($rootScope, $scope){
        "use strict";
        $scope.modalOpenBool = False;
        $scope.Open= function(){
            $scope.modalOpenBool = !$scope.modalOpenBool;
        };
    }])