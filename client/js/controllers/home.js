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

            $scope.view.bookFeedBuckets = [];
            $scope.view.sessionFeedBuckets = [];
            $scope.view.feedBucket = {feeds: []};
            function newsFeedAssembler (bucket) {
                var ext;
                if (bucket.username && bucket.username===$scope.user.username) {
                    ext = {
                        user: $scope.user
                    };
                } else if (bucket.sessionId) {
                    console.assert(bucket.session, 'need session in bucket');
                    ext = {
                        session: bucket.session
                    };
                } else if (bucket.bookId) {
                    console.assert(bucket.book, 'need book in bucket');
                    ext = {
                        book: bucket.book
                    };
                }
                var feeds = _.map(bucket.feeds, function(feed) {
                    return _.extend(feed, ext);
                });
                $scope.view.feedBucket.feeds.push.apply($scope.view.feedBucket.feeds, feeds);
            };
            // These are to construct the stand-alone getBookFeeds and getSessionFeeds method.
            Model.getUserProfile($scope.user.username)
                .then(function (me) {
                    var promise = Model.getUserFeeds($scope.user.username);

                    function bookPromiseHelper(book) {
                        promise.then(function () {
                            Model.getBookFeeds(book._id)
                                .then(function () {
                                    Model.bookFeeds.book = book;
//                                    $scope.view.bookFeedBuckets.push(Model.sessionFeeds);
                                    newsFeedAssembler(Model.bookFeeds);
                                });
                        });
                    }

                    function sessionPromiseHelper(session) {
                        promise.then(function () {
                            Model.getSessionFeeds(session._id)
                                .then(function () {
                                    Model.sessionFeeds.session = session;
//                                    $scope.view.sessionFeedBuckets.push(Model.sessionFeeds);
                                    newsFeedAssembler(Model.sessionFeeds);
                                });
                        });
                    }

                    _.each(Model.profile.sessions, sessionPromiseHelper);
                    _.each(Model.profile.books, bookPromiseHelper);

                    return promise;
                });

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
                    }
                )
            };

            Model.getSchools();

        }
    ]);
