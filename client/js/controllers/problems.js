'use strict';

/* Controllers */

//angular.module('angular-client-side-auth')
//    .controller('ProblemCtrl',
//        ['$rootScope','$scope',function($rootScope,$scope) {
//            $scope.problems = {
//                {
//                "problemUUID": "d0001",
//                "topLevel": "true",
//                "problemType": ['multipleChoice','fillIn(multiple blanks)','OpenEnded'],
//                "question": ["the first president of the US is:","and the second first lady is:","."],
//                "choices": ["Lincoln","David Cooperfield","Bush Junior","G.W. Bush"],
//                "multimedia": ['image1.png'],
//                "subproblems": [""],
//                "solution": ['Washinton','Mrs. Adams'], //security!
//                "explanation":["这道题的答案是好几个的。（<=左边说的又不是人话了。。。)"],
//                "hints": [''],
//                "hintRules": ['0','1',''],
//                "lastupdated": '23234234'
//                },
//            };
//            $scope.orderProp = 'lastupdated';
//        }]);


function ProblemCtrl($scope, $http) {
    //$http.get('problems/problems.json').success(function(data) {
    //    $scope.problems = data;
    //});
    $scope.expression = "\\( \\frac{5}{4} \\div \\frac{1}{6} \\)";
    $scope.highlightField = "question"

    $scope.problemTypes = ['multipleChoice','fillIn(multiple blanks)','OpenEnded']
    $scope.problems = [
        {
            "teststr": "\div hahahahaha",
            "problemUUID": "d0001",
            "topLevel": "true",
            "problemType": 'OpenEnded',
            "question": ["如图所示，在足够大的空间范围内，同时存在着竖直向上的匀强电场和垂直纸面向里的水平匀强磁场，磁感应强度\\(B=1.57 T\\)．小球1带正电，其电量与质量之 比为\\(4 C/kg\\)．所受重力与电场力的大小相等；小球2不带电，静止放置于固定的水平悬空支架上．小球1向右以\\(v_0=23.59 m/s\\)的水平速度与 小球2正碰，碰后经过\\(0.75 s\\)再次相碰．设碰撞前后两小球带电情况不发 生改变，且始终保持在同一竖直平面内．(取\\(g=10 m/s^2)\\)，"],

            "choices" : [],
            "multimedia": ['image1.png'],
            "subproblems": [""],
            "solutions": ['根据题目中给出的信息，我们可以推断，小球附近电场为\\(E_0\\).',''], //security!
            "explanations":["这道题的答案是好几个的。\\(\\Leftarrow\\)左边说的又不是人话了。。。",],
            "hints": [''],
            "hintRules": ['0','1',''],
            "lastupdated": '23234234'
        },{
            "teststr": "\div hahahahaha",
            "problemUUID": "d0001",
            "topLevel": "true",
            "problemType": 'multipleChoice',
            "question": ["请指出下面二元一次方程的解：\n \\(x^2 + 4x -3 = 0\\)"],
            "choices": ["\\(\\frac{-4\\pm\\sqrt{28}}{2}\\)","David Cooperfield","Bush Junior","G.W. Bush"],
            "multimedia": ['image1.png'],
            "subproblems": [""],
            "solutions": ['Washinton','Mrs. Adams'], //security!
            "explanations":["这道题的答案是好几个的。\\(\\Leftarrow\\)左边说的又不是人话了。。。",],
            "hints": [''],
            "hintRules": ['0','1',''],
            "lastupdated": '23234234'
        },{
            "teststr": "\div hahahahaha",
            "problemUUID": "d0001",
            "topLevel": "true",
            "problemType": ['multipleChoice','fillIn(multiple blanks)','OpenEnded'],
            "question": ["The first president of the US is:","and the second first lady is:","."],
            "choices": ["Lincoln","David Cooperfield","Bush Junior","G.W. Bush"],
            "multimedia": ['image1.png'],
            "subproblems": [""],
            "solutions": ['Washinton','Mrs. Adams'], //security!
            "explanations":["这道题的答案是好几个的。（<=左边说的又不是人话了。。。)"],
            "hints": [''],
            "hintRules": ['0','1',''],
            "lastupdated": '23234234'
        },
    ]
    $scope.orderProp = 'lastupdated';
};


//ProblemCtrl.$inject = ['$scope', '$http'];


//function PhoneDetailCtrl($scope, $routeParams) {
//    $scope.phoneId = $routeParams.phoneId;
//}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams'];