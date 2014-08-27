'use strict';
angular.module('SpruceQuizApp', ['ngCookies', 'ngSanitize', 'modelServices', 'ngRoute', 'ngResource', 'ngAnimate',
    'ui.bootstrap',
    'mgcrea.ngStrap.modal',
//        'mgcrea.ngStrap.select',
    'mgcrea.ngStrap.button',
    'mgcrea.ngStrap.dropdown',
    'mgcrea.ngStrap.typeahead',
    "angularFileUpload",
    'nvd3ChartDirectives', 'placeholders', 'textAngular', 'angular-medium-editor', 'flip-card'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', '$modalProvider',
        function ($routeProvider, $locationProvider, $httpProvider, $modalProvider) {

            angular.extend($modalProvider.defaults, {
                html: true
            });

            var access = rolesHelper.accessLevels;

            $routeProvider.when('/',
                {
                    templateUrl: '/partials/questions',
                    controller: 'QuestionCtrl',
                    access: access.all
                });
//            $routeProvider.when('/login',
//                {
//                    templateUrl: '/partials/frontPage',
//                    controller: 'FrontPageCtrl',
//                    access: access.all
//                });
            $routeProvider.when('/questions',
                {
                    templateUrl: '/partials/questions',
                    controller: 'QuestionCtrl',
                    access: access.all
                });
            $routeProvider.when('/home',
                {
                    templateUrl: '/partials/home',
                    controller: 'HomeCtrl',
                    access: access.loggedin
                });
            $routeProvider.when('/questions/:questionId',
                {
                    templateUrl: '/partials/questions',
                    controller: 'QuestionCtrl',
                    access: access.all
                });
            $routeProvider.when('/users/:username',
                {
                    templateUrl: '/partials/users',
                    controller: 'UserCtrl',
                    access: access.all
                });
            /**
             * This ordering of the route is very important. Otherwise the id field
             * would be recognized as a book authorName.
             */
            $routeProvider.when('/books/id/:bookId',
                {
                    templateUrl: '/partials/books',
                    controller: 'BookCtrl',
                    access: access.all
                });
            $routeProvider.when('/books/:bookTitle',
                {
                    templateUrl: '/partials/books',
                    controller: 'BookCtrl',
                    access: access.all
                });
            $routeProvider.when('/books/:authorName/:bookTitle',
                {
                    templateUrl: '/partials/books',
                    controller: 'BookCtrl',
                    access: access.all
                });
            $routeProvider.when('/sessions/:sessionId',
                {
                    templateUrl: '/partials/sessions',
                    controller: 'SessionCtrl',
                    access: access.all
                });
//            $routeProvider.when('/reports',
//                {
//                    templateUrl: '/partials/reports',
//                    controller: 'ReportCtrl',
//                    access: access.superuser
//                });
            $routeProvider.when('/teacher',
                {
                    templateUrl: '/partials/teacher',
                    controller: 'TeacherCtrl',
                    access: access.superuser
                });
            $routeProvider.when('/superadmin',
                {
                    templateUrl: '/partials/superadmin',
                    controller: 'SuperAdminCtrl',
                    access: access.superadmin
                });
            $routeProvider.when('/development',
                {
                    templateUrl: '/partials/development',
                    controller: 'DevelopmentCtrl',
                    access: access.superadmin
                });
//            $routeProvider.when('/404',
//                {
//                    templateUrl: '/partials/404',
//                    access: access.all
//                });
            $routeProvider.otherwise({redirectTo: '/404'});

            $locationProvider.html5Mode(true);

            /**
             * the following template can be used to intercept unauthorized
             * requests.
             * For public users, this is a way to generate a popup for registration.
             */
//        $httpProvider.interceptors.push(function ($q, $location) {
//            return {
//                'responseError': function (response) {
//                    if (response.status === 401 || response.status === 403) {
//                        $location.path('/');
//                        return $q.reject(response);
//                    }
//                    else {
//                        return $q.reject(response);
//                    }
//                }
//            }
//        });

        }])

    .run(['$rootScope', '$location', '$route', 'Auth', function ($rootScope, $location, $route, Auth) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.error = null;
            if (!Auth.authorize(next.access)) {
                // event.preventDefault();
                $rootScope.error = "access prohibited.";
                if (Auth.isLoggedIn()) {
                    $location.path('/home');
                } else {
                    $location.path('/');
                }
            } else {
                // $location.path(next);
            }
        });

        $rootScope.appInitialized = true;
    }]);