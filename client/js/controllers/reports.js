'use strict';

/* Controllers */

angular.module('SpruceQuizApp')
    .controller('ReportCtrl',
        // the 'Reports' service is the driver code for the server API.
        // it is located in service.js.
        //      ['$rootScope', '$scope', 'Reports', function($rootScope, $scope, Problems) {
        ['$rootScope', '$scope','Students', 'AuthUsers', function($rootScope, $scope, Students, AuthUsers) {

//Begin of "Don't delete" for testing $resource:
            //API usage examples:
            //get single & all
            //$scope.students.push(Students.onStudents.get({uuid: "u0003"}));
            //$scope.students = Students.onstudents.list();

            //remove
            //Students.onStudents.remove({uuid: "u0003"});
            //AuthUsers.onUsers.remove({uuid: "u0003"});

            //update - need fix
            // var stu = Students.onStudents.get({uuid: "u0003"}, function() {
            //     stu.address = "newaddr";
            //     stu.$save();
            // });
            // var stu = {
            //         userUUID: "u0003",
            //         firstName: "Charlie",
            //         lastName: "Thompson",
            //         dateOfBirth: "",
            //         sex: "Male",
            //         email: "cthompson@spruceaca.edu",
            //         phone: ["12345678", "87654321"],
            //         address: "ddd",
            //         profilePic: "",
            //         sections: ["g0004", "g0005"],
            //         schools: ["s0002"],
            //         exams: ["e0005", "e0006"],
            //         comments: ""
            //     };
            // Students.onStudents.$save(stu);
//End of don't delete

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

