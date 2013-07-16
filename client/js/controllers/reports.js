'use strict';

/* Controllers */

angular.module('SpruceQuizApp')
    .controller('ReportCtrl',
        // the 'Reports' service is the driver code for the server API.
        // it is located in service.js.
        //      ['$rootScope', '$scope', 'Reports', function($rootScope, $scope, Problems) {
        ['$rootScope', '$scope','Problems', function($rootScope, $scope,Problems) {
            $scope.problems = Problems.list();
            $scope.rankFakeData = ['a data point'];
            $scope.orderProp = 'lastupdated';
            $scope.expression = "a math expression: \\(\\sqrt{\\frac{1}{2}}\\)";

        }]);

