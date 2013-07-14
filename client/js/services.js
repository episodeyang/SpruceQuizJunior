'use strict';

angular.module('angular-client-side-auth')
.factory('Auth', function($http, $rootScope, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles;

    $rootScope.user = $cookieStore.get('user') || { username: '', role: userRoles.public };
    $cookieStore.remove('user');

    $rootScope.accessLevels = accessLevels;
    $rootScope.userRoles = userRoles;

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = $rootScope.user.role;
            return accessLevel & role;
        },
        isLoggedIn: function(user) {
            if(user === undefined){
                user = $rootScope.user;
                };
            return user.role === userRoles.student || user.role === userRoles.parents || user.role === userRoles.teacher || user.role === userRoles.admin;
            //return function(){
            //    if(user.role in userRoles && user.role !== userRoles.public){
            //        return true;
            //        }
            //    else{
            //        return false;
            //        };
            //};
        },
        register: function(user, success, error) {
            $http.post('/register', user).success(success).error(error);
        },
        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                $rootScope.user = user;
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                $rootScope.user.username = '';
                $rootScope.user.role = userRoles.public;
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles
    };
});

angular.module('angular-client-side-auth')
.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/users').success(success).error(error);
        }
    };
});

angular.module('spruceDBServices', ['ngResource'])
.factory('Problems', function($resource){
    return $resource('/api/problems/:uuid', {uuid:'@problemUUID'}, {
        list: {method:'GET', params:{uuid: 'all'}, isArray:true},
    });
});

// angular.module('angular-client-side-auth')
// .factory('Problems', function($http) {
//     return {
//         getAll: function(success, error) {
//             $http.get('/problems').success(success).error(error);
//         },
//         getbyId: function(success, error) {
//             $http.get('/api/problems/', {params:{uuid: "d0001"}}).success(success).error(error);
//             //$http.get('/api/problems/id').success(success).error(error);
//         }
//     };
// });
