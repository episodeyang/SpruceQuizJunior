'use strict';

angular.module('modelServices', ['ngResource', 'ngRoute'])
//Model Code
    .factory('Model', ['$rootScope', 'Students',
        function ($rootScope, Students) {
        var modelInstance = {};
        // testing code
        modelInstance.test = 1;
        modelInstance.init = function () {
            modelInstance.user = $rootScope.user;
            // somewhat magically routeConfig just works...
            //modelInstance.user.userRoles = routeConfig.userRoles;

            //TODO: Look up user role from routeConfig.userRoles and assign to ModelIntance.user.userRole
            //TODO: Now with ModelInstance.user.userRole, call '/api/%userRole/:id and load it into ModelInstance.user
            //      At the end of the day, user should have both the original keys as well as those from 'student',
            //      'teacher', 'parent', 'admin' etc.
            //      Also, all the sections, schools, and exams should at this point be loaded into `user`
            //TODO: Testing Cases: I want testing cases to include testing cases for four different user types. Also
            //      Check all the schema.
            //      Check if schools, sections, and exams are loaded.

            //modelInstance.user = Students.onStudents.list();

        };
        modelInstance.destroy = function () {
        };

        //The following are for tomorrow:
        //TODO: Model.getSchools(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};
        //      handle input cases of :
        //          model == undefined => model = Model.user
        //
        //TODO: Model.getSections(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};
        //TODO: Model.getExams(Model.user) or () <= function(model){ If (model==undefined) {model = Model.user;}};

        //TODO: Model.schools <= This is the school object for general use.
        //TODO: Model.updateSchools() <= input is a list
        //TODO: Model.section.addStudent()
        //TODO: Model.deleteSchools() <= imput is a list

        //TODO: Model.sections<= This is the section object for general use.
        //TODO: Model.getSections()
        //TODO: MOdel.updateSections()
        //TODO: Model.exams <= This is the school object for general use.
        //TODO: Model.onExams()
        //TODO: Model.problems<= This is the school object for general use.
        //TODO: Model.onExams()

        return modelInstance;
    }])
// Interface Code
    .factory('Problems', function ($resource) {
        return {
            onProblems: $resource('/api/problems/:uuid',
                {
                    uuid: '@problemUUID'
                },
                {
                    list: {method: 'GET', params: {uuid: 'all'}, isArray: true},
                    update: {method: 'PUT', params: {uuid: '@problemUUID'}
                }
            })
        };
    })
    .factory('AuthUsers', function ($resource) {
        return {
            onUsers: $resource('/api/users/:uuid', {uuid: '@id'}, {
                //list: {method:'GET', params:{uuid: 'all'}, isArray:true},
            })
        };
    })
    .factory('Students', function ($resource) {
        return {
            onStudents: $resource('/api/students/:uuid', {uuid: '@userUUID'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true},
                update: {method: 'PUT', params: {uuid: '@userUUID'}},
                save: {method: 'POST'},
                remove: {method: 'DELETE', params: {uuid: '@userUUID'}}
            }),
            onTeachers: $resource('/api/students/:uuid/teachers', {uuid: '@userUUID'}, {
            }),
            onSchools: $resource('/api/students/:uuid/schools', {uuid: '@userUUID'}, {
            }),
            onSections: $resource('/api/students/:uuid/sections', {uuid: '@userUUID'}, {
                get: {method: 'GET', params: {uuid: '@uuid'}, isArray: true}
            }),
            onFeeds: $resource('/api/students/:uuid/feeds/:flim', {uuid: '@userUUID'}, {
                get: {method: 'GET', params: {uuid: '@uuid'}, isArray: true}
            })
        };
    })
    .factory('Teachers', function ($resource) {
        return {
            onTeachers: $resource('/api/teachers/:uuid', {uuid: '@userUUID'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true}
            }),
            onSchools: $resource('/api/teachers/:uuid/schools', {uuid: '@userUUID'}, {
            }),
            onStudents: $resource('/api/teachers/:uuid/students', {uuid: '@userUUID'}, {
            }),
            onSections: $resource('/api/teachers/:uuid/sections', {uuid: '@userUUID'}, {
            })
        };
    })
    .factory('Schools', function ($resource) {
        return {
            onSchools: $resource('/api/schools/:uuid', {uuid: '@schoolUUID'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true}
            }),
            onTeachers: $resource('/api/schools/:uuid/teachers', {uuid: '@schoolUUID'}, {
            }),
            onStudents: $resource('/api/schools/:uuid/students', {uuid: '@schoolUUID'}, {
            }),
            onSections: $resource('/api/schools/:uuid/sections', {uuid: '@schoolUUID'}, {
                get: {method: 'GET', params: {uuid: '@uuid'}, isArray: true}
            })
        };
    })
    .factory('Units', function ($resource) {
        return {
            onUnits: $resource('/api/units/:uuid', {uuid: '@unitUUID'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true}
            }),
            onArchived: $resource('/api/units/:uuid/archived', {uuid: '@unitUUID'}, {
                get: {method: 'GET', params: {uuid: '@uuid'}, isArray: true}
            }),
            onMaterials: $resource('/api/units/:uuid/materials/:mid/:toArchive', {uuid: '@unitUUID'}, {
                update: {method: 'PUT', params: {uuid: '@uuid', mid: '@mid', toArchive: '@toArchive'}}
            })
        };
    })
    .factory('Materials', function ($resource) {
        return {
            onMaterials: $resource('/api/materials/:uuid', {uuid: '@materialUUID'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true}
            })
        };
    })
    .factory('Sections', function ($resource) {
        return {
            onSections: $resource('/api/sections/:uuid', {uuid: '@sectionUUID'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true},
                update: {method: 'PUT', params: {uuid: '@uuid'}}
            }),
            onStudents: $resource('/api/sections/:uuid/students', {uuid: '@sectionUUID'}, {
            }),
            onTeachers: $resource('/api/sections/:uuid/teachers', {uuid: '@sectionUUID'}, {
            }),
            onSchools: $resource('/api/sections/:uuid/schools', {uuid: '@sectionUUID'}, {
            }),
            onUnits: $resource('/api/sections/:uuid/units', {uuid: '@sectionUUID'}, {
                get: {method: 'GET', params: {uuid: '@uuid'}, isArray: true}
            }),
            onFeeds: $resource('/api/sections/:uuid/feeds/:flim', {uuid: '@sectionUUID'}, {
                get: {method: 'GET', params: {uuid: '@uuid', flim: '50'}, isArray: true}
            })
        };
    });

