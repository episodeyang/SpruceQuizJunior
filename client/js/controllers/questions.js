'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('QuestionCtrl',
        ['$routeParams', '$location', '$filter', '$rootScope', '$scope', '$modal', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
            function ($routeParams, $location, $filter, $rootScope, $scope, $modal, Auth, Sections, Units, Materials, Students, Model) {
                //Boiler Plate for authentication info
                $scope.user = Auth.user;
                $scope.userRoles = Auth.userRoles;
                $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

                if ( window.location.host.indexOf('youzi') == 0) {
                    $scope.orgTitle = "游子 - ";
                };
                $scope.debug= {
                    alert: function(){
                        alert('konami code success');
                    }
                };
                $rootScope.errorClear = function(){
                    $rootScope.error = null;
                };
                $scope.Model = Model;

                $scope.view = {
                    state: 'search'//three states: search, ask, all-questions
                };
                $rootScope.errors = {};
                $scope.modal = $modal;

                // Todo: double check, if not used can delete.
                var submit = function (){
                    alert($scope.loginForm);
                    Auth.login($scope.loginForm,
                        function(res) {
                            $location.path('/questions');
                            console.log('log in successfully, jumping to /questions page');
                        },
                        function(err) {
                            $rootScope.errors.login = "Failed to login";
                        });
                };

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
                    ['h3', 'h4'], ['p', 'pre', 'quote'],
                    ['bold', 'italics', 'underline'], ['ul', 'ol'],
                    ['justifyLeft','justifyCenter','justifyRight'],
                    ['insertImage', 'insertLink', 'unlink'],
                    ['html']
                ];

                $scope.editor.example = '<p>这是迎春杯数学竞赛的一道应用题：</p><p><br></p><pre>甲、乙两车分别从A、B两地同时出发相向而行，6小时后相遇在C点，如果甲车速度不变，乙车每小时多行5千米，且两车还从A、B两地同时出发相向而行，则相遇地点距C点12千米；如果乙车速度不变，甲车每小时多行5千米，且两车还从A、B两地同时出发相向而行，则相遇地点距C点16千米，甲车原来每小时行多少千米？<br> <ol><li><span style="line-height: 1.428571429;">20</span></li><li><span style="line-height: 1.428571429;">40</span></li><li><span style="line-height: 1.428571429;">30</span></li><li><span style="line-height: 1.428571429;">10</span></li></ol></pre><h4>我尝试的过程：</h4><p><br></p><blockquote>设乙增加速度后，两车在D处相遇，所用时间为T小时，甲增加速度后，两车在E处相遇，由于这两种情况，两车的速度和相同，所以所用时间也相同，于是甲、乙不增加速度时，经T小时分别到达D，E。DE＝12+16＝28（千米）。<br><br>由于甲或乙增加速度每小时5千米，两车在D或E相遇，所以用每小时5千米的速度，T小时走过28千米，从而T＝28÷5＝28/5（小时），甲用6-28/5＝2/5（小时），走过12千米，所以甲原来每小时行12÷2/5＝30（千米）。</blockquote><p>问题：有没有更快更简单的解法？</p>';

                $scope.example = function () {
                    $scope.editor.text_temp = $scope.editor.data.text;
                    $scope.editor.data.text = $scope.editor.example;
                };
                $scope.toggleHtml = function () {
                    $scope.editor.showHtml = !$scope.editor.showHtml;
                    mixpanel.track("toggleHtml");
                };

                $scope.$watch('editor.tagText', function(newVal){
                    if (newVal.length === 0) { return null ; }
                    if (newVal.slice(-1) === "," || newVal.slice(-1) === "，") {
                        $scope.editor.data.tags.push(newVal.slice(0,-1));
                        $scope.editor.tagText = '';
                    }
                });

                if ($routeParams.questionId) {
                    $scope.view.state = 'question';
                    Model.getQuestion($routeParams.questionId);
                }

                Model.queryQuestions();

                var validator = function(data) {
                    if (data.title.length < 10) {
                        return $rootScope.error = "标题写的不清楚，这样会降低别人回答你的问题的几率。请再重新考虑一下吧！";
                        mixpanel.track("question title too short");
                    }
                    if (data.text.length < 50) {
                        return $rootScope.error = "正文字数太少了，可以将问题讲得更清楚一些吗？"
                        mixpanel.track("question too short");
                    }
                };

                $scope.editor.submit = function() {
                    validator($scope.editor.data);
                    if (!$rootScope.error) {
                        Model.createQuestion(
                            $scope.editor.data,
                            function(){
                                $rootScope.error = '';
                                $location.path('/questions/'+Model.question.id);
                                mixpanel.track("submitted question");
                            }
                        );
                    }
                };
                $scope.editor.updateQuestion = function () {
                    var update = {
                        id: $scope.editor.data.id,
                        title: $scope.editor.data.title,
                        text: $scope.editor.data.text,
                        tags: $scope.editor.data.tags
                    }
                    validator(update);
                    if (!$rootScope.error) {
                        Model.saveQuestion(
                            update,
                            function () {
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
                $scope.removeQuestion = function (question) {
                    Model.removeQuestion(
                        question,
                        function () {
                            $location.path('/');
                        }
                    )
                }

                $scope.answerEditor = {}
                $scope.answerEditor.data = {text: ''}
                $scope.answerEditor.options = {
                    buttons: ['bold', 'italic', 'underline', 'anchor', 'header1', 'header2', 'quote', 'superscript', 'subscript', 'strikethrough', ' unorderedlist', 'orderedlist', 'pre', 'image'],
                    placeholder: "请在这里输入你的解答。" +
                        "如需修改文字风格，请高亮文字。风格编辑工具会自动显示。"
                };

                $scope.addAnswer = function () {
                    Model.addAnswer(
                        $scope.answerEditor.data,
                        function(result) { $scope.answerEditor.data = {}; }
                    )
                }
                $scope.editAnswer = function(answer) {
                    $scope.answerEditor.data = answer;
                    $scope.view.answerEdit = true;
                    answer.viewEdit = true;
                }
                $scope.updateAnswer = function (answer) {
                    Model.updateAnswer(
                        $scope.answerEditor.data,
                        function(result) {
                            $scope.answerEditor.data = {};
                            $scope.view.answerEdit = false;
                            delete answer.viewEdit;
                        }
                    )
                }
                $scope.cancelUpdateAnswer = function (answer) {
                    $scope.answerEditor.data = {};
                    delete answer.viewEdit;
                    delete $scope.view.answerEdit;
                }
                $scope.removeAnswer = function (answer) {
                    console.log('removing this answer')
                    Model.removeAnswer(
                        answer,
                        function(result) { $scope.answerEditor.data = {}; }
                    )
                }
                $scope.voteupAnswer = Model.voteupAnswer;
                $scope.votedownAnswer = Model.votedownAnswer;

                $scope.view.commentEditor = {};
                $scope.view.answerCommentEditor = {};
                $scope.commentEditor = {data: {}};
                $scope.showCommentEditor = function (answer) {
                    function setViewStateFalse (obj) {
                        try {obj.view.state = false;}
                        catch (e) {};
                    }
                    if (answer) {
                        _.each(Model.question.answers, setViewStateFalse)
                        answer.view = { state: true };
                    }
                    else {
                        $scope.view.commentEditor.state = true;
                    }
                }
                $scope.cancelCommentEdit = function (answer) {
                    if (answer) {
                        answer.view = { state: false };
                    }
                    else {
                        $scope.view.commentEditor.state = false;
                    }
                    $scope.commentEditor = {data: {}};
                }

                function clearCommentEditor () {
                    $scope.commentEditor = {data: {}};
                }
                $scope.submitComment = function(answer) {
                    if (answer) { Model.addAnswerComment($scope.commentEditor.data, answer, clearCommentEditor);
                    }
                    if (!answer) {
                        Model.addComment($scope.commentEditor.data, clearCommentEditor);
                    };
                }

                $scope.voteupComment = Model.voteupComment;
                $scope.votedownComment = Model.votedownComment;
                $scope.removeComment = Model.removeComment;
                $scope.voteupAnswerComment = Model.voteupAnswerComment;
                $scope.votedownAnswerComment = Model.votedownAnswerComment;
                $scope.removeAnswerComment = Model.removeAnswerComment;

            }
        ]
    );
