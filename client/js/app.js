'use strict';
angular.module('SpruceQuizApp', ['ui.bootstrap','angular-underscore','ngCookies', 'spruceDBServices', 'ngResource'])

    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

        var access = routingConfig.accessLevels;

        $routeProvider.when('/',
            {
                templateUrl:    '/partials/home',
                controller:     'HomeCtrl',
                access:         access.loggedin
            });
        $routeProvider.when('/login',
            {
                templateUrl:    '/partials/login',
                controller:     'LoginCtrl',
                access:         access.anon
            });
        $routeProvider.when('/register',
            {
                templateUrl:    '/partials/register',
                controller:     'RegisterCtrl',
                access:         access.anon
            });
        $routeProvider.when('/auth/twitter',
            {
                templateUrl:    '/partials/register',
                controller:     'RegisterCtrl',
                access:         access.anon
            });
        $routeProvider.when('/private',
            {
                templateUrl:    '/partials/private',
                controller:     'PrivateCtrl',
                access:         access.loggedin
            });
        $routeProvider.when('/admin',
            {
                templateUrl:    '/partials/admin',
                controller:     'AdminCtrl',
                access:         access.superuser
            });
        $routeProvider.when('/sections',
            {
                templateUrl:    '/partials/sections',
                controller:     'SectionCtrl',
                access:         access.loggedin
            });
        $routeProvider.when('/problems',
            {
                templateUrl:    '/partials/problems',
                controller:     'ProblemCtrl',
                access:         access.superuser
            });
        $routeProvider.when('/problems/edit',
            {
                templateUrl:    '/partials/problems_edit',
                controller:     'ProblemEditCtrl',
                access:         access.superuser
            });
        $routeProvider.when('/reports',
            {
                templateUrl:    '/partials/reports',
                controller:     'ReportCtrl',
                access:         access.superuser
            });
        $routeProvider.when('/404',
            {
                templateUrl:    '/partials/404',
                access:         access.all
            });
        $routeProvider.otherwise({redirectTo:'/404'});

        $locationProvider.html5Mode(true);

        var interceptor = ['$location', '$q', function($location, $q) {
            function success(response) {
                return response;
            }

            function error(response) {

                if(response.status === 401) {
                    $location.path('/login');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }

            return function(promise) {
                return promise.then(success, error);
            }
        }];

        $httpProvider.responseInterceptors.push(interceptor);

    }])

    .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.error = null;
            if (!Auth.authorize(next.access)) {
                if(Auth.isLoggedIn()) $location.path('/');
                else                  $location.path('/login');
            }
        });

        //$rootScope.appInitialized = true;
    }]);