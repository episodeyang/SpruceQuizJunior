'use strict';
var sqApp = angular.module('SpruceQuizApp');
sqApp.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

sqApp.factory('Auth', ['$http', '$rootScope', '$cookieStore', 'Model', function($http, $rootScope, $cookieStore, Model){

    var accessLevels = rolesHelper.accessLevels
        , userRoles = rolesHelper.userRoles;

    function modelInitializationCallBack (){
        console.log('Model Initialization started');
        Model.init();
    };

    function modelDestroyCallBack (){
        console.log('Model Destroy started');
        Model.destroy();
    };

    $rootScope.user = $cookieStore.get('user') || { username: '', role: userRoles.public, id: ''};
    $cookieStore.remove('user');

    if ($rootScope.user.id != '') {
        modelInitializationCallBack();
    }
    $rootScope.accessLevels = accessLevels;
    $rootScope.userRoles = userRoles;

    return {

        authorize: function(accessLevel, role) {
//            console.log('check if authorized');
            if(role === undefined)
                role = $rootScope.user.role;
            return accessLevel & role;
        },
        isLoggedIn: function(user) {
//            console.log('checking if isLoggedIn');
            if(user === undefined){
                user = $rootScope.user;
            }

            return user.role === userRoles.student || user.role === userRoles.parent || user.role === userRoles.teacher || user.role === userRoles.admin || user.role === userRoles.superadmin;
        },
        register: function (user, success, error) {
            $http.post('/register', user).success(success).error(error);
        },
        login: function (user, success, error) {
            $http.post('/login', user).success(function (user) {
                $rootScope.user = user;
                modelInitializationCallBack();
                success(user);
            }).error(error);
        },
        logout: function (success, error) {
            $http.post('/logout').success(function () {
                $rootScope.user.username = '';
                $rootScope.user.role = userRoles.public;
                $rootScope.user.id = '';
                modelDestroyCallBack();
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles
    };

}]);


angular.module('SpruceQuizApp')
.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/users').success(success).error(error);
        }
    };
});
