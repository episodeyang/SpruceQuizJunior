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

            //Get example: single & all
            //$scope.students.push(Students.onStudents.get({uuid: "u0003"}));
            //$scope.students = Students.onstudents.list();

            //Create example:
            // var stu = {
            //         userUUID: "u0004",
            //         firstName: "David",
            //         lastName: "Williams",
            //         dateOfBirth: "",
            //         sex: "Male",
            //         email: "dwilliams@spruceaca.edu",
            //         phone: ["12345678", "87654321"],
            //         address: "addr",
            //         profilePic: "",
            //         sections: ["g0004", "g0005"],
            //         schools: ["s0002"],
            //         exams: ["e0007", "e0008"],
            //         comments: ""
            //     };
            // Students.onStudents.save(stu);

            //Remove example: [note: use keyword 'remove' instead of 'delete']
            //Students.onStudents.remove({uuid: "u0003"});
            //AuthUsers.onUsers.remove({uuid: "u0003"});

            //Update example: 
            //Students.onStudents.update({uuid: "u0003", address: "newaddr", email: "newemail@spruceaca.edu"});
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

