'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('SessionCtrl',
    ['$routeParams', '$location', '$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
        function ($routeParams, $location, $filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
            //Boiler Plate for authentication info
            $scope.user = Auth.user;
            $scope.userRoles = Auth.userRoles;
            $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

            if (window.location.host.indexOf('youzi') == 0) {
                $scope.orgTitle = "游子 - ";
            }
            $scope.debug = {
                alert: function () {
                    alert('konami code success');
                }
            };
            $rootScope.errorClear = function () {
                $rootScope.error = null;
            };
            $scope.Model = Model;

            $scope.view = {
                state: 'info',
                card: {
                    flipped: false
                }
            };
            $rootScope.errors = {};

            if ($routeParams.sessionId) {
                Model.getSession($routeParams.sessionId, function () {
                    Model.session.getFeeds(function(){
                        $scope.view.feedBucket = Model.sessionFeeds;
                    });
                });
            }


            $scope.addTeacher = function (index) {
                console.log(index);
//                    Model.session.save();
            };
            $scope.updateSession = function () {
                Model.saveSession(
                    function () {
                        $scope.view.session.edit = false;
                    }
                );
            };

            $scope.$watch('view.state', function (newVal, oldVal) {
                if (newVal === "questions" && Model.session.getQuestions) {
                    Model.session.getQuestions();
                    console.log('detected view state change to questions');
                }
                if (newVal === "info" && Model.session.getFeeds) {
                    Model.session.getFeeds();
                    $scope.view.feedBucket = Model.sessionFeeds;
                    console.log('detected view state change to questions');
                }
            });

            $scope.editor = {};
            $scope.editor.options = {
                buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 'quote', 'superscript', 'subscript', 'strikethrough', ' unorderedlist', 'orderedlist', 'pre', 'image'],
                placeholder: "请在这里输入你的问题。" +
                    "如需修改文字风格，请高亮文字。风格编辑工具会自动显示。"
            };

        }
    ]);
