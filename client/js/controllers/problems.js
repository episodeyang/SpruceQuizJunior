'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('ProblemCtrl',
        ['$routeParams', '$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
            function ($routeParams, $filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
                //Boiler Plate for authentication info
                $scope.user = Auth.user;
                $scope.userRoles = Auth.userRoles;
                $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

                $scope.model = {}
                $scope.model.user = $rootScope.user
                $scope.model.sections = []
                $scope.Model = Model;
                //function ProblemCtrl($scope, Problems)
                //$rootScope.error = "Temp warning";
                $scope.expression = "\\( \\frac{5}{4} \\div \\frac{1}{6} \\)";
                $scope.highlightField = "question";

                $scope.problemTypes = ['multipleChoice', 'fillIn', 'OpenEnded'];

                $scope.view = {};
                $scope.view.state = 'search'; //three states: search, ask, all-questions
                $scope.editor = {};
                $scope.editor.text = '';
                $scope.editor.options = {
                    buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 'quote', 'superscript', 'subscript', 'strikethrough', ' unorderedlist', 'orderedlist', 'pre', 'image'],
                    placeholder: "请在这里输入你的问题。" +
                        "如需修改文字风格，请高亮文字。风格编辑工具会自动显示。"
                };
                $scope.editor.answerOptions = {
                    buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 'quote', 'superscript', 'subscript', 'strikethrough', ' unorderedlist', 'orderedlist', 'pre', 'image'],
                    placeholder: "请在这里输入你的解答。" +
                        "如需修改文字风格，请高亮文字。风格编辑工具会自动显示。"
                };

                $scope.editor.example = '<p>这是迎春杯数学竞赛的一道应用题：</p><p><br></p><pre>甲、乙两车分别从A、B两地同时出发相向而行，6小时后相遇在C点，如果甲车速度不变，乙车每小时多行5千米，且两车还从A、B两地同时出发相向而行，则相遇地点距C点12千米；如果乙车速度不变，甲车每小时多行5千米，且两车还从A、B两地同时出发相向而行，则相遇地点距C点16千米，甲车原来每小时行多少千米？<br> <ol><li><span style="line-height: 1.428571429;">20</span></li><li><span style="line-height: 1.428571429;">40</span></li><li><span style="line-height: 1.428571429;">30</span></li><li><span style="line-height: 1.428571429;">10</span></li></ol></pre><h4>我尝试的过程：</h4><p><br></p><blockquote>设乙增加速度后，两车在D处相遇，所用时间为T小时，甲增加速度后，两车在E处相遇，由于这两种情况，两车的速度和相同，所以所用时间也相同，于是甲、乙不增加速度时，经T小时分别到达D，E。DE＝12+16＝28（千米）。<br><br>由于甲或乙增加速度每小时5千米，两车在D或E相遇，所以用每小时5千米的速度，T小时走过28千米，从而T＝28÷5＝28/5（小时），甲用6-28/5＝2/5（小时），走过12千米，所以甲原来每小时行12÷2/5＝30（千米）。</blockquote><p>问题：有没有更快更简单的解法？</p>';

                $scope.example = function(){
                    $scope.editor.text_temp = $scope.editor.text;
                    $scope.editor.text = $scope.editor.example;
                };
                $scope.toggleHtml = function(){
                    $scope.editor.showHtml = !$scope.editor.showHtml;
                };

                $rootScope.$on("$locationChangeStart", function (event, next, current) {
                    console.log($routeParams.problemId);
                });

                if ($routeParams.problemId) {
                    $scope.view.state = 'problem';
                    $scope.problem = {
                        title: '行程问题解法',
                        text: $scope.editor.example,
                        tags: ['三年级', '数学', '二元一次方程'],
                        author: {
                            name: '王小一个',
                        },
                        dateCreated: '一月三日'
                    }
                }

                $scope.problems = [
                    {
                        title: '行程问题解法',
                        text: $scope.editor.example,
                        tags: ['三年级', '数学', '二元一次方程'],
                        author: {
                            name: '王小一个',
                        },
                        dateCreated: '一月三日'
                    },
                    {
                        title: '行程问题解法',
                        text: $scope.editor.example,
                        tags: ['三年级', '数学', '二元一次方程'],
                        author: {
                            name: '王小一个',
                        },
                        dateCreated: '一月三日'
                    }

                ];
                //Use the next two lines if accessing a specific problem with a uuid
                //$scope.problems = [];
                //$scope.problems.push(Problems.get({uuid: "p0001"}));

                //Use the next line to get all problems
//                $scope.problems = Problems.onProblems.list();

                //old way using $http
                // Problems.getAll(function(res) {
                //     $scope.problems = res;
                // }, function(err) {
                //     $rootScope.error = "Failed to fetch problems.";
                // });

                // Problems.getbyId(function(res) {
                //     $scope.problems = res;
                // }, function(err) {
                //     $rootScope.error = "Failed to fetch problems.";
                // });
                $scope.orderProp = 'lastupdated';
            }
        ]
    );

//ProblemCtrl.$inject = ['$scope', '$http'];


//function PhoneDetailCtrl($scope, $routeParams) {
//    $scope.phoneId = $routeParams.phoneId;
//}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams'];