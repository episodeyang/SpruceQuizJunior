'use strict';

/* Controllers */

angular.module('SpruceQuizApp')
    .controller('ReportCtrl',
        // the 'Reports' service is the driver code for the server API.
        // it is located in service.js.
        //      ['$rootScope', '$scope', 'Reports', function($rootScope, $scope, Problems) {
        ['$rootScope', '$scope','StudentProperties', function($rootScope, $scope,StudentProperties) {
            $scope.problems =StudentProperties.list();
            $scope.rankFakeData = ['a data point'];
            $scope.orderProp = 'lastupdated';
            $scope.expression = "a math expression: \\(\\sqrt{\\frac{1}{2}}\\)";
            $scope.class={
                "id1":{
                    "students":{
                        "studentId1":{
                            "examScores":{
                                "数学第一次练习"：100,//key 的名称就是考试的名字
                                "数学第二次练习"：100,
                            },
                        "someList":[1,2,3,4,5]
                        },
                    "distribution":{}

                    }
                },
            }
        }]);

