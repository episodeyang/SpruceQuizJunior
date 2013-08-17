'use strict';

/* Controllers */

angular.module('SpruceQuizApp')
    .controller('ReportCtrl',
        // the 'Reports' service is the driver code for the server API.
        // it is located in service.js.
        //      ['$rootScope', '$scope', 'Reports', function($rootScope, $scope, Problems) {
        ['$rootScope', '$scope','Students', 'AuthUsers', function ($rootScope, $scope, Students, AuthUsers) {
            $scope.student = {};
            $scope.classRankFakeData = {
                u1: {
                    firstname: "小红",
                    lastname: "张",
                    grade: 95,
                    effort: 20,
                    progress: 0
                },
                u2: {
                    firstname: "小军",
                    lastname: "刘",
                    grade: 47,
                    effort: 40,
                    progress: 10
                },
                u3: {
                    firstname: "小歌",
                    lastname: "杨",
                    grade: 100,
                    effort: 0,
                    progress: 0
                },
                u4: {
                    firstname: "小理中",
                    lastname: "陈",
                    grade: 99,
                    effort: 10,
                    progress: 1
                },
                u5: {
                    firstname: "小轶凡",
                    lastname: "吴",
                    grade: 97,
                    effort: 5,
                    progress: 0
                }
            };
            $scope.reportData = [{
                title: '总体情况',
                content: '## 不同科目发展情况图'
            }]
            $scope.rankFakeData = ['a data point'];
            $scope.orderProp = 'lastupdated';
            $scope.expression = "a math expression: \\(\\sqrt{\\frac{1}{2}}\\)";
            // $scope.class={
            //     "id1":{
            //         "students":{
            //             "studentId1":{
            //                 "examScores":{
            //                     "数学第一次练习"：100,//key 的名称就是考试的名字
            //                     "数学第二次练习"：100,
            //                 },
            //             "someList":[1,2,3,4,5]
            //             },
            //         "distribution":{}

            //         }
            //     },
            // }
        }]);

