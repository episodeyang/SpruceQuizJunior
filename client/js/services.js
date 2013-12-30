'use strict';
var sqApp = angular.module('SpruceQuizApp');
sqApp.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

sqApp.factory('Auth', ['$http', '$rootScope', '$cookieStore', 'Model', function($http, $rootScope, $cookieStore, Model){

    var accessLevels = rolesHelper.accessLevels
        , userRoles = rolesHelper.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public, id: ''};

    function modelInitializationCallBack (){
        console.log('Model Initialization started');
        Model.init();
    };

    function modelDestroyCallBack (){
        console.log('Model Destroy started');
        Model.destroy();
    };

    $cookieStore.remove('user');

    if (currentUser.id != '') {
        modelInitializationCallBack();
    }

    function changeUser(user) {
        _.extend(currentUser, user);
    };
    return {

        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = currentUser.role;
            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined){
                user = currentUser;
            }
            return user.role.bitMask === userRoles.student.bitMask || user.role.bitMask === userRoles.parent.bitMask || user.role.bitMask === userRoles.teacher.bitMask || user.role.bitMask === userRoles.admin.bitMask || user.role.bitMask === userRoles.superadmin.bitMask;
        },
        register: function (user, success, error) {
            $http.post('/register', user).success(success).error(error);
        },
        login: function (user, success, error) {
            $http.post('/login', user).success(function (user) {
                changeUser(user);
                modelInitializationCallBack();
                success(user);
            }).error(error);
        },
        logout: function (success, error) {
            $http.post('/logout').success(function () {
                currentUser.username = '';
                currentUser.role = userRoles.public;
                currentUser.id = '';
                modelDestroyCallBack();
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
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
