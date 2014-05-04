'use strict';
var sqApp = angular.module('SpruceQuizApp');
sqApp.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});

sqApp.factory('Auth', ['$http', '$rootScope', '$cookieStore', 'Model', function($http, $rootScope, $cookieStore, Model){

    var accessLevels = rolesHelper.accessLevels;
    var userRoles = rolesHelper.userRoles;
    var currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public, id: ''};
    var getHash = passwordHash.getHash;


    function modelInitializationCallBack(user) {
//        console.log('Model Initialization started');
        Model.init(user);
    }
    function modelDestroyCallBack() {
//        console.log('Model Destroy started');
        Model.destroy();
    }
    $cookieStore.remove('user');

    if (currentUser.id != '') {
        modelInitializationCallBack(currentUser);
    }

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
            var userCopy = _.extend({}, user);
            userCopy.password = getHash(user.password);
//            console.log('show the content of user')
//            console.log(user)
            $http.post('/register', userCopy).success(function (user) {
                _.extend(currentUser, user);
                modelInitializationCallBack(currentUser);
                success(user);
            }).error(error);
        },
        login: function (user, success, error) {
            var userCopy = _.extend({}, user);
            userCopy.password = getHash(user.password);
            $http.post('/login', userCopy).success(function (user) {
                _.extend(currentUser, user);
                modelInitializationCallBack(currentUser);
                success(user);
            }).error(error);
        },
        logout: function (success, error) {
            $http.post('/logout').success(function () {
                _.extend(currentUser,{
                    username: '',
                    role: userRoles.public,
                    id: ''
                });
                modelDestroyCallBack();
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };

}]);


