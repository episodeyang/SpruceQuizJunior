'use strict';
angular.module('SpruceQuizApp', ['ngCookies', 'ngSanitize', 'modelServices', 'ngRoute', 'ngResource', 'ngAnimate',
        'ui.bootstrap', 'nvd3ChartDirectives', 'placeholders', 'textAngular', 'angular-medium-editor'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

        var access = rolesHelper.accessLevels;

        $routeProvider.when('/',
            {
                templateUrl: '/partials/questions',
                controller: 'QuestionCtrl',
                access: access.all
            });
        $routeProvider.when('/login',
            {
                templateUrl: '/partials/frontPage',
                controller: 'FrontPageCtrl',
                access: access.all
            });
        $routeProvider.when('/questions',
            {
                templateUrl: '/partials/questions',
                controller: 'QuestionCtrl',
                access: access.all
            });
//        $routeProvider.when('/home',
//            {
//                templateUrl: '/partials/home',
//                controller: 'HomeCtrl',
//                access: access.loggedin
//            });
//        $routeProvider.when('/errata/:errataId',
//            {
//                templateUrl: '/partials/errata',
//                controller: 'ErrataCtrl',
//                access: access.loggedin
//            });
//        $routeProvider.when('/public/login',
//            {
//                templateUrl: '/partials/public/login',
//                controller: 'LoginCtrl',
//                access: access.anon
//            });
//        $routeProvider.when('/public/register',
//            {
//                templateUrl: '/partials/public/register',
//                controller: 'LoginCtrl',
//                access: access.anon
//            });
//        $routeProvider.when('/auth/twitter',
//            {
//                templateUrl: '/partials/register',
//                controller: 'RegisterCtrl',
//                access: access.anon
//            });
//        $routeProvider.when('/private',
//            {
//                templateUrl: '/partials/private',
//                controller: 'PrivateCtrl',
//                access: access.loggedin
//            });
//        $routeProvider.when('/admin',
//            {
//                templateUrl: '/partials/admin',
//                controller: 'AdminCtrl',
//                access: access.superuser
//            });
//        $routeProvider.when('/sections',
//            {
//                templateUrl: '/partials/sections',
//                controller: 'SectionCtrl',
//                access: access.loggedin
//            });
        $routeProvider.when('/questions/:questionId',
            {
                templateUrl: '/partials/questions',
                controller: 'QuestionCtrl',
                access: access.all
            });
//        $routeProvider.when('/reports',
//            {
//                templateUrl: '/partials/reports',
//                controller: 'ReportCtrl',
//                access: access.superuser
//            });
//        $routeProvider.when('/superadmin',
//            {
//                templateUrl: '/partials/superadmin',
//                controller: 'SuperAdminCtrl',
//                access: access.superadmin
//            });
//        $routeProvider.when('/development',
//            {
//                templateUrl: '/partials/development',
//                controller: 'DevelopmentCtrl',
//                access: access.superadmin
//            });
//        $routeProvider.when('/404',
//            {
//                templateUrl: '/partials/404',
//                access: access.all
//            });
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

    .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.error = null;
            if (!Auth.authorize(next.access)) {
                $location.path(current);
                $rootScope.error = "access prohibited."
//                if (Auth.isLoggedIn()) {
//                    $location.path('/');
//                    console.log('is logged in');
//                }
//                else {
//                    $location.path('/login');
//                    console.log('not logged in');
//                }
            }
        });

        $rootScope.appInitialized = true;
    }]);