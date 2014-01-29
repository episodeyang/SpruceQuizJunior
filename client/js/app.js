'use strict';
angular.module('SpruceQuizApp', ['ngCookies', 'ngSanitize', 'modelServices', 'ngRoute', 'ngResource', 'ngAnimate',
        'ui.bootstrap', 'nvd3ChartDirectives', 'placeholders', 'angular-medium-editor'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

        var access = rolesHelper.accessLevels;

        $routeProvider.when('/login',
            {
                templateUrl: '/partials/frontPage',
                controller: 'FrontPageCtrl',
                access: access.anon
            });
        $routeProvider.when('/',
            {
                templateUrl: '/partials/problems',
                controller: 'ProblemCtrl',
                access: access.loggedin
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
        $routeProvider.when('/problems/:problemId',
            {
                templateUrl: '/partials/problems',
                controller: 'ProblemCtrl',
                access: access.loggedin
            });
        $routeProvider.when('/problems/edit',
            {
                templateUrl: '/partials/problems_edit',
                controller: 'ProblemEditCtrl',
                access: access.superuser
            });
        $routeProvider.when('/reports',
            {
                templateUrl: '/partials/reports',
                controller: 'ReportCtrl',
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
        $routeProvider.when('/404',
            {
                templateUrl: '/partials/404',
                access: access.all
            });
        $routeProvider.otherwise({redirectTo: '/404'});

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            }
        });

    }])

    .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.error = null;
            if (!Auth.authorize(next.access)) {
                if (Auth.isLoggedIn()) {
                    $location.path('/');
                }
                else {
                    $location.path('/login');
                }
            }
        });

        $rootScope.appInitialized = true;
    }]);