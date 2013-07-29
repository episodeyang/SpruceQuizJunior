'use strict';
var sqApp = angular.module('SpruceQuizApp');
//sqApp.$inject = ['ui.bootstrap','Auth','User',"$element", "$attrs"];

//angular.module('SpruceQuizApp')
sqApp.factory('Auth', function($http, $rootScope, $cookieStore){

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

angular.module('SpruceQuizApp')
.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/users').success(success).error(error);
        }
    };
});

angular.module('spruceDBServices', ['ngResource'])
.factory('Problems', function($resource){
    return {
        onProblems: $resource('/api/problems/:uuid', {uuid:'@problemUUID'}, {
            list: {method:'GET', params:{uuid: 'all'}, isArray:true}
        })
    };
})
.factory('AuthUsers', function($resource){
    return {
        onUsers: $resource('/api/users/:uuid', {uuid:'@id'}, {
            //list: {method:'GET', params:{uuid: 'all'}, isArray:true},
        })
    };
})
.factory('Students', function($resource){
    return {
        onStudents: $resource('/api/students/:uuid', {uuid:'@userUUID'}, {
            list: {method:'GET', params:{uuid: 'all'}, isArray:true},
            update: {method:'PUT', params:{uuid: '@uuid'}}
        }),
        onTeachers: $resource('/api/students/:uuid/teachers', {uuid:'@userUUID'}, {
        }),
        onSchools: $resource('/api/students/:uuid/schools', {uuid:'@userUUID'}, {
        }),
        onSections: $resource('/api/students/:uuid/sections', {uuid:'@userUUID'}, {
            get: {method:'GET', params:{uuid: '@uuid'}, isArray:true}
        })
    };
})
.factory('Teachers', function($resource){
    return {
        onTeachers: $resource('/api/teachers/:uuid', {uuid:'@userUUID'}, {
            list: {method:'GET', params:{uuid: 'all'}, isArray:true}
        }),
        onSchools: $resource('/api/teachers/:uuid/schools', {uuid:'@userUUID'}, {
        }),
        onStudents: $resource('/api/teachers/:uuid/students', {uuid:'@userUUID'}, {
        }),
        onSections: $resource('/api/teachers/:uuid/sections', {uuid:'@userUUID'}, {
        })
    };
})
.factory('Schools', function($resource){
    return {
        onSchools: $resource('/api/schools/:uuid', {uuid:'@schoolUUID'}, {
            list: {method:'GET', params:{uuid: 'all'}, isArray:true}
        }),
        onTeachers: $resource('/api/schools/:uuid/teachers', {uuid:'@schoolUUID'}, {
        }),
        onStudents: $resource('/api/schools/:uuid/students', {uuid:'@schoolUUID'}, {
        }),
        onSections: $resource('/api/schools/:uuid/sections', {uuid:'@schoolUUID'}, {
        })
    };
})
.factory('Units', function($resource){
    return {
        onUnits: $resource('/api/units/:uuid', {uuid:'@unitUUID'}, {
            list: {method:'GET', params:{uuid: 'all'}, isArray:true}
        })
        // onMaterials: $resource('/api/units/:uuid/materials/:mid', {uuid:'@unitUUID', mid:'@materialUUID'}, {
        //     update: {method:'PUT', params:{uuid: '@uuid', mid: '@mid'}}
        // })
    };
})
.factory('Materials', function($resource){
    return {
        onUnits: $resource('/api/materials/:uuid', {uuid:'@materialUUID'}, {
            list: {method:'GET', params:{uuid: 'all'}, isArray:true}
        })
    };
})
.factory('Sections', function($resource){
    return {
        onSections: $resource('/api/sections/:uuid', {uuid:'@sectionUUID'}, {
            list: {method:'GET', params:{uuid: 'all'}, isArray:true},
            update: {method:'PUT', params:{uuid: '@uuid'}}
        }),
        onStudents: $resource('/api/sections/:uuid/students', {uuid:'@sectionUUID'}, {
        }),
        onTeachers: $resource('/api/sections/:uuid/teachers', {uuid:'@sectionUUID'}, {
        }),
        onSchools: $resource('/api/sections/:uuid/schools', {uuid:'@sectionUUID'}, {
        }),
        onUnits: $resource('/api/sections/:uuid/units', {uuid:'@sectionUUID'}, {
            get: {method:'GET', params:{uuid: '@uuid'}, isArray:true}
        })
    };
});

    // .factory('StudentProperties', function($resource){
    //     //TODO: I want an API that looks like:
    //     //      /api/student/:id/grades/:key
    //     return $resource('/api/problems/:uuid', {}, {
    //         list: {method:'GET', params:{uuid: 'all'}, isArray:true},
    //     });
    // });
// angular.module('SpruceQuizApp')
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
