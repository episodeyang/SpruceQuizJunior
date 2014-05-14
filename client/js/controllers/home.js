'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('HomeCtrl',
    ['_', '$routeParams', '$location', '$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
        function (_, $routeParams, $location, $filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
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
                state: 'newsFeed',
                modalState: 'mySessions',
                profile: {}
            };
            $scope.view.profile.edit = false;

            $rootScope.errors = {};

            $scope.view.timeline = {
                predicate: 'time',
                reverse: true
            };
            Model.getUserProfile($scope.user.username);
            Model.getUserFeeds($scope.user.username);

            function isArray(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }

            $scope.addEmptySchool = function () {
                Model.profile.schoolRecord.push({
                    name: '',
                    classYear: null,
                    entrance: null,
                    left: null,
                    alumni: null,
                    type: '',
                    majors: ['']
                });
            };

            $scope.editProfile = function () {

                $scope.view.profile.edit = true;

                function removeNullAddEmptyToEnd(obj, key) {
                    if (isArray(obj) && key !== 'schoolRecord') {
                        obj.map(function (value, index) {
                            if (!value) {
                                obj.splice(index, 1);
                            }
                        });
                        obj.push('');
                    }
                }

                _.map(Model.profile, removeNullAddEmptyToEnd);

                if (Model.profile.role.title === 'student' || true) {
                    _.map(Model.profile.schoolRecord[Model.profile.schoolRecord.length - 1], removeNullAddEmptyToEnd);
                }

            };
            $scope
                .$watch(
                    'Model.profile',
                    function (newVal, oldVal) {
                    },
                    true
                );
            $scope.submitProfile = function () {

                function removeNull(obj, key) {
                    if (isArray(obj)) {
                        obj.map(function (value, index) {
                            if (!value) {
                                obj.splice(index, 1);
                            }
                        });
                    }
                }

                _.map(Model.profile, removeNull);

                if (Model.profile.role.title === 'student' || true) {
                    var school = Model.profile.schoolRecord[Model.profile.schoolRecord.length - 1];
                    _.map(Model.profile.schoolRecord[Model.profile.schoolRecord.length - 1], removeNull);

                    if (school !== undefined) {
                        if (!school.name) {
                            Model.profile.schoolRecord.splice(-1);
                        }
                    } else {
                        Model.profile.schoolRecord = [];
                    }
                }

                Model.updateUserProfile(
                    function () {
                        $scope.view.profile.edit = false;
                    })
            };

            Model.getSchools();
            Model.getSessions();
            $scope.sessionData = {
                tags: [],
                tag: '',
                teachers: [],
                teacher: ''
            };
            $scope.$watch(
                'sessionData.tag',
                function(newVal, oldVal) {
                    if (!newVal) {return}
                    if (newVal[newVal.length-1]=="," || newVal[newVal.length-1]=="，" || newVal[newVal.length-1]==" " ) {
                        $scope.sessionData.tags.push(newVal.slice(0, -1));
                        $scope.sessionData.tag = '';
                    }
                }
            );
            $scope.$watch(
                'sessionData.teacher',
                function(newVal, oldVal) {
                    if (!newVal) {return}
                    if (newVal[newVal.length-1]=="," || newVal[newVal.length-1]=="，" || newVal[newVal.length-1]==" " ) {
                        $scope.sessionData.teachers.push(
                            { name: newVal.slice(0, -1) }
                        );
                        $scope.sessionData.teacher = '';
                    }
                }
            );

            $scope.submitSession = function(session) {
                if (!session) { var session = $scope.sessionData; }
                if (!session.school) { session.school = Model.profile.schoolRecord[Model.profile.schoolRecord.length-1].name; }

                function callback(err, session) {
                    if (err || !session) {return err || 'noSessionUpdated'; }
                    if (!session._id) {return $rooteScope.error = 'sessionDoesNotHaveIdField'; }
                    Model.profile.addSession(session._id, function() {
                        $scope.view.modalState='searchSessions';
                    });
                }

                delete $scope.sessionData.tag;
                delete $scope.sessionData.teacher;
                Model.submitSession(session, callback);
            };
        }
    ]);
