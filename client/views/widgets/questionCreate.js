/**
 * Created by ge on 5/18/14.
 */

'use strict';

angular.module('SpruceQuizApp')
    .controller('QuestionEditorCtrl',
    ['$routeParams', '$location', '$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
        function ($routeParams, $location, $filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
            //Boiler Plate for authentication info
            $scope.user = Auth.user;
            $scope.userRoles = Auth.userRoles;
            $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

            $scope.Model = Model;

            $rootScope.errorClear = function () {
                $rootScope.error = null;
            };

            $rootScope.errors = {};

            // editor options
            $scope.editor = { tagText: "" };
            $scope.editor.data = {
                title: "",
                text: '',
                author: $scope.Model.user,
                tags: []
            };
            $scope.editor.options = {
                buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 'quote', 'superscript', 'subscript', 'strikethrough', ' unorderedlist', 'orderedlist', 'pre', 'image'],
                placeholder: "请在这里输入你的问题。" +
                    "如需修改文字风格，请高亮文字。风格编辑工具会自动显示。"
            };

            $scope.editor.toolbar = [
                ['redo', 'undo', 'clear'],
                ['h3', 'h4'],
                ['p', 'pre', 'quote'],
                ['bold', 'italics', 'underline'],
                ['ul', 'ol'],
                ['justifyLeft', 'justifyCenter', 'justifyRight'],
                ['insertImage', 'insertLink', 'unlink'],
                ['html']
            ];

            $scope.editor.example = '<p>这是迎春杯数学竞赛的一道应用题：</p><p></p><pre>甲、乙两车分别从A、B两地同时出发相向而行，6小时后相遇在C点，如果甲车速度不变，乙车每小时多行5千米，且两车还从A、B两地同时出发相向而行，则相遇地点距C点12千米；如果乙车速度不变，甲车每小时多行5千米，且两车还从A、B两地同时出发相向而行，则相遇地点距C点16千米，甲车原来每小时行多少千米？<ol><li><span style="line-height: 1.428571429;">20</span></li><li><span style="line-height: 1.428571429;">40</span></li><li><span style="line-height: 1.428571429;">30</span></li><li><span style="line-height: 1.428571429;">10</span></li></ol></pre><h4>我尝试的过程：</h4><p></p><blockquote>设乙增加速度后，两车在D处相遇，所用时间为T小时，甲增加速度后，两车在E处相遇，由于这两种情况，两车的速度和相同，所以所用时间也相同，于是甲、乙不增加速度时，经T小时分别到达D，E。DE＝12+16＝28（千米）。<br><br>由于甲或乙增加速度每小时5千米，两车在D或E相遇，所以用每小时5千米的速度，T小时走过28千米，从而T＝28÷5＝28/5（小时），甲用6-28/5＝2/5（小时），走过12千米，所以甲原来每小时行12÷2/5＝30（千米）。</blockquote><p>问题：有没有更快更简单的解法？</p>';

            // view functions
            $scope.example = function () {
                $scope.editor.text_temp = $scope.editor.data.text;
                $scope.editor.data.text = $scope.editor.example;
            };
            $scope.toggleHtml = function () {
                $scope.editor.showHtml = !$scope.editor.showHtml;
                mixpanel.track("toggleHtml");
            };

            function onSession(data) {
                if ($routeParams.sessionId) {
                    data.sessions = [$routeParams.sessionId];
                }
            }

            function onBook(data) {
                if ($routeParams.bookTitle || $routeParams.bookId) {
                    data.books = [
                        {
                            _id: Model.book.id || Model.book._id,
                            title: Model.book.title,
                            authors: Model.book.authors
                        }
                    ];
                }
            }

            var validator = function (data) {
                if (data.title.length < 10) {
                    return $rootScope.error = "标题写的不清楚，这样会降低别人回答你的问题的几率。请再重新考虑一下吧！";
                    mixpanel.track("question title too short");
                }
                if (data.text.length < 10) {
                    return $rootScope.error = "正文字数太少了，可以将问题讲得更清楚一些吗？";
                    mixpanel.track("question too short");
                }
            };

            // submission and update
            $scope.editor.submit = function () {
                onSession($scope.editor.data);
                onBook($scope.editor.data);
                validator($scope.editor.data);
                if (!$rootScope.error) {
                    Model.createQuestion(
                        $scope.editor.data,
                        function (question) {
                            $rootScope.error = '';
                            if (question.sessions.length >= 1) {
                                // this is now done in the backend.
                                // Model.session.addQuestion(question._id);
                            }
                            if (question.books.length >= 1) {
                                // this is now removed. questions tagged with a book is found through search.
                                // Model.book.addQuestion(question._id);
                            }
                            $location.path('/questions/' + Model.question._id);
                            mixpanel.track("submitted question to session");
                        }
                    );
                }
            };
            $scope.editor.updateQuestion = function () {
                var update = {
                    _id: $scope.editor.data._id,
                    title: $scope.editor.data.title,
                    text: $scope.editor.data.text,
                    tags: $scope.editor.data.tags
                };
                validator(update);
                if (!$rootScope.error) {
                    Model.question.save(
                        update,
                        function (question) {
                            $rootScope.error = '';
                            $scope.view.state = 'question';
                        },
                        function () {
                            if (!$rootScope.error) {
                                $rootScope.error = "server error, please refresh"
                            }
                        }
                    );
                }
            };
            $scope.editor.cancel = function () {
                $scope.view.state = 'question';
                $scope.editor.data = {};
            };
            $scope.editor.showEditView = function () {
                $scope.view.state = 'question.edit';
                $scope.editor.data = Model.question
            };

        }
    ]
);

