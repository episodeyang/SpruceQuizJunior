'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('SessionEditCtrl',
    ['$routeParams', '$location', '$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
        function ($routeParams, $location, $filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
            //Boiler Plate for authentication info
            $scope.user = Auth.user;
            $scope.userRoles = Auth.userRoles;
            $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

            $rootScope.errors = {};
            $scope.Model = Model;
            $scope.view = {
                modalState: 'list', // list, search, create
                sessions: []
            };

            // this is the create new session model.
            $scope.sessionData = {
                tags: []
            };

            console.log($location.url());

            if ($routeParams.sessionId) {
                Model.getSession($routeParams.sessionId);
//                $scope.view.sessions = Model.session.sessions;
//                $scope.view.removeSession = Model.session.removeSession;
            } else if ($routeParams.username) {
                Model.getUser($routeParams.username);
                $scope.view.sessions = Model.profile.sessions;
            } else if ($location.url() == '/home') {
                /**
                 * list of view handles:
                 * - view.sessions: list of sessions belong to the user etc.
                 * - view.addSession(session): add session event hook
                 * - view.removeSession(session): remove session event hook
                 */
                Model.getSessions();
                $scope.view.sessions = Model.profile.sessions;
                console.log($scope.view.sessions);

                $scope.view.addSession = function (sessionId, index) {
                    function success(sessions) {
                        if (index !== undefined) {
                            Model.sessions[index].selected = true;
                        }
                        $scope.view.sessions = Model.profile.sessions;
                    }

                    Model.profile.addSession(sessionId, success);
                };

                $scope.view.removeSession = function (sessionId, index) {
                    function success(sessions) {
                        if (index !== undefined) {
                            Model.sessions[index].selected = false;
                        }
                        $scope.view.sessions = Model.profile.sessions;
                    }

                    Model.profile.removeSession(sessionId, success);
                };

                $scope.view.submitSession = function (sessionData) {
                    if (!sessionData) {
                        sessionData = $scope.sessionData;
                    }
                    var sessionCreated;

                    function createSuccess(session) {
                        sessionCreated = session;
                        Model.profile.addSession(session._id, addSuccess);
                    }

                    function addSuccess() {
                        $location.path('/sessions/' + sessionCreated._id);
                        $scope.apply();
                    }

                    if (!sessionData.school) {
                        try {
                            sessionData.school = Model.profile.schoolRecord[Model.profile.schoolRecord.length - 1].name;
                        } catch (e) {
                            $rootScope.error = '需要填写学校名称';
                        }
                    }
                    // console.log(sessionData);
                    Model.createSession(sessionData, createSuccess);
                };
            }

        }
    ]);
