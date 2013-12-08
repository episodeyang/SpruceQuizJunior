'use strict';

angular.module('modelServices', ['ngResource', 'ngRoute'])


    // need to change to onSelf or discuss with Lizhong
    .factory('AuthUsers', function ($resource) {
        return {
            onUsers: $resource('/api/users/:uuid', {uuid: '@id'}, {
                //list: {method:'GET', params:{uuid: 'all'}, isArray:true},
            })
        };
    })
    .factory('Students', function ($resource) {
        return {
            onErrata: $resource('/api/students/errata/:id', {id: '@_id'}, {
                list: {method: 'GET', params: {id: 'all'}, isArray: true},
                create: {method: 'POST', params: {id: 'create'}}
            }),
            onProblemNotes: $resource('/api/students/errata/:eid/problemNotes/:id', {eid: '@eid', id: '@id'}, {
                list: {method: 'GET', params: {id: 'all'}, isArray: true},
                create: {method: 'POST', params: {eid: '@eid', id: 'create'}},
                update: {method: 'PUT', params: {eid: '@eid', id: '@id'}},
                remove: {method: 'DELETE', params: {eid: '@eid', id: '@id'}}
            }),
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

    //TODO: dummy
    .factory('Parents', function ($resource) {
        return {
            onMaterials: $resource('/api/materials/:uuid', {uuid: '@materialUUID'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true}
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

    .factory('Admins', function ($resource) {
        return {
//            onTeachers: $resource('/api/teachers/:uuid', {uuid:'@userUUID'}, {
//                list: {method:'GET', params:{uuid: 'all'}, isArray:true}
//            }),
//            onSchools: $resource('/api/teachers/:uuid/schools', {uuid:'@userUUID'}, {
//            }),
//            onStudents: $resource('/api/teachers/:uuid/students', {uuid:'@userUUID'}, {
//            }),
            onSections: $resource('/api/admins/sections/:id', {id: '@_id'}, {
                list: {method: 'GET', params: {id: 'all'}, isArray: true},
                create: {method: 'POST', params: {id: 'create'}}
            })
        };
    })
    // Interface Code
    .factory('Superadmins', function ($resource) {
        return {
//            onTeachers: $resource('/api/teachers/:uuid', {uuid:'@userUUID'}, {
//                list: {method:'GET', params:{uuid: 'all'}, isArray:true}
//            }),
//            onSchools: $resource('/api/teachers/:uuid/schools', {uuid:'@userUUID'}, {
//            }),
//            onStudents: $resource('/api/teachers/:uuid/students', {uuid:'@userUUID'}, {
//            }),
            onSections: $resource('/api/admins/sections/:id', {id: '@_id'}, {
                list: {method: 'GET', params: {id: 'all'}, isArray: true},
                create: {method: 'POST', params: {id: 'create'}}
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

    .factory('Sections', function ($resource) {
        return {
            onSections: $resource('/api/sections/:id', {id: '@_id'}, {
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

    .factory('Problems', function ($resource) {
        return {
            onProblems: $resource('/api/problems/:uuid', {uuid: '@problemUUID'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true},
                update: {method: 'PUT', params: {uuid: '@problemUUID'}}
            })
        };
    })
;