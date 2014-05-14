'use strict';

angular.module('resourceProvider', ['ngResource', 'ngRoute'])
    .factory('Users', ['$resource', function ($resource) {
        var Users = $resource('/api/users', {}, {
            create: {method: 'POST'},
            list: {method: 'GET'}
        });
        var User = $resource('/api/users/:username', {username: '@username'});
        var Feeds = $resource('/api/users/:username/feeds', {username: '@username'});
        var FeedsByPage = $resource('/api/users/:username/feeds/:page', {username: '@username', page: '@page'});
        var Sessions = $resource('/api/users/:username/sessions', {username: '@username'});
        return {
            list: $resource('/api/users'),
            onUsers: $resource('/api/users/:uuid', {uuid: '@id'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true}
            }),
            get: User.get,
            save: User.save,
            getFeeds: Feeds.get,
            getFeedsByPage: FeedsByPage.get,
            updateSessions: Sessions.save
        };
    }])
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
        var Parent = $resource('/api/parents/:username', {username: '@username'});
        return {
            onMaterials: $resource('/api/materials/:uuid', {uuid: '@materialUUID'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true}
            }),
            get: Parent.get
        };
    })
    .factory('Teachers', function ($resource) {
        var Teacher = $resource('/api/teachers/:username', {username: '@username'});
        return {
            onTeachers: $resource('/api/teachers/:uuid', {uuid: '@userUUID'}, {
                list: {method: 'GET', params: {uuid: 'all'}, isArray: true}
            }),
            onSchools: $resource('/api/teachers/:uuid/schools', {uuid: '@userUUID'}, {
            }),
            onStudents: $resource('/api/teachers/:uuid/students', {uuid: '@userUUID'}, {
            }),
            onSections: $resource('/api/teachers/:uuid/sections', {uuid: '@userUUID'}, {
            }),
            get: Teacher.get
        };
    })
    .factory('Admins', function ($resource) {
        var Admin = $resource('/api/admins/:username', {username: '@username'});
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
            }),
            get: Admin.get
        };
    })
    .factory('Superadmins', function ($resource) {
        var Superadmin = $resource('/api/superadmin/:username', {username: '@username'});
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
            }),
            get: Superadmin.get
        };
    })
    .factory('Schools', function ($resource) {
        var Schools = $resource('/api/schools');
        var School = $resource('/api/schools/:name', {name: '@name'});
        return {
            index: Schools.query,
            search: $resource('/api/schools/:name/search', {id: '@_id'}).get,
            add: Schools.create,
            get: School.get,
            save: School.save,
            remove: School.remove
        };
    })
    .factory('Sessions', function ($resource) {
        var Sessions = $resource('/api/sessions');
        var Session = $resource('/api/sessions/:sessionId', {sessionId: '@_id'});
        return {
            index: Sessions.query,
            search: $resource('/api/sessions/search').get,
            add: Sessions.create,
            get: Session.get,
            save: Session.save,
            remove: Session.remove
        };
    })
    .factory('Books', function ($resource) {
        var Book = $resource('/api/books/:author/:title', {title: '@title', author: '@author'});
        var Books = $resource('/api/books');
        var BookById = $resource('/api/books/:id', {id: '@_id'});
        return {
            add: Books.create,
            get: Book.get,
            save: BookById.save,
            remove: BookById.remove
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
    });