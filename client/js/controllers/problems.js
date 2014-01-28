'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('ProblemCtrl',
        ['$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
            function ($filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
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
                }


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