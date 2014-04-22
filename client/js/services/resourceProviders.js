'use strict';

angular.module('resourceProvider', ['ngResource', 'ngRoute'])
    .factory('Users', ['$resource', function ($resource) {
        return {
            list: $resource('/api/users'),
            onUsers: $resource('/api/users/:uuid', {uuid: '@id'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true},
            })
        };
    }])
    //@todo: Need testing, just finished 2014/02/10
    .factory('Questions', function ($resource) {
        var Questions = $resource('/api/questions', {}, {
            create: {method: 'POST'}
        });
        var Question = $resource('/api/questions/:id', {id: '@id'});
        return {
            get: Question.get,
            query: Questions.query,
            create: Questions.create,
            save: Question.save,
            remove: Question.remove
        };
    })
    .factory('Answers', function ($resource) {
        var Answers = $resource('/api/questions/:id/answers', {id: '@id'}, {
            create: {method: 'POST'}
        });
        var Answer = $resource('/api/questions/:id/answers/:answerId', {id: '@id', answerId: '@answerId'});
        return {
            add: Answers.create,
            save: Answer.save,
            remove: Answer.remove
        };
    })
    .factory('Comments', function ($resource) {
        var Comments = $resource('/api/questions/:id/comments', {id: '@id'}, {
            create: {method: 'POST'}
        });
        var Comment = $resource('/api/questions/:id/comments/:commentId', {id: '@id', commentId: '@commentId'});
        return {
            add: Comments.create,
            save: Comment.save,
            remove: Comment.remove
        };
    })
    .factory('AnswerComments', function ($resource) {
        var AnswerComments = $resource('/api/questions/:id/answers/:answerId/comments', {id: '@id', answerId: '@answerId'}, {
            create: {method: 'POST'}
        });
        var AnswerComment = $resource('/api/questions/:id/answers/:answerId/comments/:commentId', {id: '@id', answerId: '@answerId', commentId: '@commentId'});
        return {
            add: AnswerComments.create,
            save: AnswerComment.save,
            remove: AnswerComment.remove
        };
    })
    .factory('Students', function ($resource) {
        var Student = $resource('/api/students/:username', {username: '@username'});
        return {
            get: Student.get,
            save: Student.save,
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