var _ =           require('underscore')
    , path =      require('path')
    , passport =  require('passport')
    , AuthCtrl =  require('./controllers/auth')
    , UserCtrl =  require('./controllers/user')
    , ProblemCtrl =  require('./controllers/problem')
    , StudentCtrl =  require('./controllers/student')
    , TeacherCtrl =  require('./controllers/teacher')
    , AdminCtrl =  require('./controllers/admin')
    , SuperadminCtrl =  require('./controllers/superadmin')
    , SectionCtrl =  require('./controllers/section')
    , SchoolCtrl =  require('./controllers/school')
    , UnitCtrl =  require('./controllers/unit')
    , MaterialCtrl =  require('./controllers/material')
    , User =      require('./models/User.js')
    , userRoles = require('../client/js/rolesHelper').userRoles
    , accessLevels = require('../client/js/rolesHelper').accessLevels;

var routes = [

    // Views
     {
        path: '/partials/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }],
        accessLevel: accessLevels.public
    },
    {   //Need to give more fine-grained control to the client side scripts,
        //so that not all client side scripts are exposed to anonymous users.
        path: '/js/mathJax/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }],
        accessLevel: accessLevels.public
    },
    {   //Need to give more fine-grained control to the client side scripts,
        //so that not all client side scripts are exposed to anonymous users.
        path: '/js/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }],
        accessLevel: accessLevels.loggedin
    },

    // OAUTH
    {
        path: '/auth/twitter',
        httpMethod: 'GET',
        middleware: [passport.authenticate('twitter')],
        accessLevel: accessLevels.public
    },
    {
        path: '/auth/twitter/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/login'
        })],
        accessLevel: accessLevels.public
    },
    {
        path: '/auth/facebook',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook')],
        accessLevel: accessLevels.public
    },
    {
        path: '/auth/facebook/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        })],
        accessLevel: accessLevels.public
    },
    {
        path: '/auth/google',
        httpMethod: 'GET',
        middleware: [passport.authenticate('google')],
        accessLevel: accessLevels.public
    },
    {
        path: '/auth/google/return',
        httpMethod: 'GET',
        middleware: [passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        })],
        accessLevel: accessLevels.public
    },
    {
        path: '/auth/linkedin',
        httpMethod: 'GET',
        middleware: [passport.authenticate('linkedin')],
        accessLevel: accessLevels.public
    },
    {
        path: '/auth/linkedin/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('linkedin', {
            successRedirect: '/',
            failureRedirect: '/login'
        })],
        accessLevel: accessLevels.public
    },

    // Local Auth
    {
        path: '/register',
        httpMethod: 'POST',
        middleware: [AuthCtrl.register],
        accessLevel: accessLevels.public
    },
    {
        path: '/login',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login],
        accessLevel: accessLevels.public
    },
    {
        path: '/logout',
        httpMethod: 'POST',
        middleware: [AuthCtrl.logout],
        accessLevel: accessLevels.public
    },

    // User resource
    {
        path: '/users',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, UserCtrl.index],
        accessLevel: accessLevels.superuser
    },

    //APIs needed by client
    //School resource
    {
        path: '/api/schools/:uuid',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, SchoolCtrl.getbyId],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/schools/:uuid/teachers',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, SchoolCtrl.getTeachers],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/schools/:uuid/students',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, SchoolCtrl.getStudents],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/schools/:uuid/sections',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, SchoolCtrl.getSections],
        accessLevel: accessLevels.loggedin
    },
    //Superadmin resource
    {
        path: '/api/superadmins/sections/:id',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, SuperadminCtrl.getSections],
        accessLevel: accessLevels.superadmin
    },
    //Admin resource
    //v0.1
    {
        path: '/api/admins/sections/:id',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, AdminCtrl.getSections],
        accessLevel: accessLevels.admin
    },
    //v0.1
    {
        path: '/api/admins/sections/:id',
        httpMethod: 'POST',
        middleware: [ensureAuthenticated, ensureAuthorized, AdminCtrl.createSections],
        accessLevel: accessLevels.admin
    },
    //v0.1
    {
        path: '/api/admins/sections/:id',
        httpMethod: 'DELETE',
        middleware: [ensureAuthenticated, ensureAuthorized, AdminCtrl.removeSections],
        accessLevel: accessLevels.admin
    },
    //v0.1
    {
        path: '/api/admins/sections/:id',
        httpMethod: 'PUT',
        middleware: [ensureAuthenticated, ensureAuthorized, AdminCtrl.updateSections],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/admins/schools/:id',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, AdminCtrl.getSchools],
        accessLevel: accessLevels.admin
    },
    //Teacher resources
    {
        path: '/api/teachers/:uuid',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, TeacherCtrl.getbyId],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/teachers/:uuid',
        httpMethod: 'DELETE',
        middleware: [ensureAuthenticated, ensureAuthorized, TeacherCtrl.removebyId],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/teachers/:uuid/sections',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, TeacherCtrl.getSections],
        accessLevel: accessLevels.superuser
    },
    {
        path: '/api/teachers/:uuid/schools',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, TeacherCtrl.getSchools],
        accessLevel: accessLevels.superuser
    },
    {
        path: '/api/teachers/:uuid/students',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, TeacherCtrl.getStudents],
        accessLevel: accessLevels.superuser
    },
    //Student resources
    //v0.1
    {
        path: '/api/students/errata/:id',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.getErrata],
        accessLevel: accessLevels.loggedin
    },
    //v0.1
    {
        path: '/api/students/errata/:id',
        httpMethod: 'POST',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.createErrata],
        accessLevel: accessLevels.loggedin
    },
    //v0.1
    {
        path: '/api/students/errata/:id',
        httpMethod: 'DELETE',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.removeErrata],
        accessLevel: accessLevels.loggedin
    },
    //v0.1
    {
        path: '/api/students/errata/:id',
        httpMethod: 'PUT',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.updateErrata],
        accessLevel: accessLevels.loggedin
    },
    //v0.1
    {
        path: '/api/students/errata/:eid/problemNotes/:id',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.getProblemNotes],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/students/:uuid',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.getbyId],
        accessLevel: accessLevels.superuser
    },
    {
        path: '/api/students/:uuid',
        httpMethod: 'DELETE',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.removebyId],
        accessLevel: accessLevels.admin
    },
    {
        path: '/api/students/:uuid',
        httpMethod: 'POST',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.savebyId],
        accessLevel: accessLevels.superuser
    },
    {
        path: '/api/students/:uuid',
        httpMethod: 'PUT',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.updatebyId],
        accessLevel: accessLevels.superuser
    },
    {
        path: '/api/students/:uuid/schools',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.getSchools],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/students/:uuid/teachers',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.getTeachers],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/students/:uuid/sections',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.getSections],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/students/:uuid/feeds/:flim',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, StudentCtrl.getFeeds],
        accessLevel: accessLevels.loggedin
    },
    //AuthUser resources
    {
        path: '/api/users/:uuid',
        httpMethod: 'DELETE',
        middleware: [ensureAuthenticated, ensureAuthorized, UserCtrl.removebyId],
        accessLevel: accessLevels.admin
    },
    //Section resources
    {
        path: '/api/sections/:id',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, SectionCtrl.getbyId],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/sections/:uuid',
        httpMethod: 'POST',
        middleware: [ensureAuthenticated, ensureAuthorized, SectionCtrl.savebyId],
        accessLevel: accessLevels.superuser
    },
    {
        path: '/api/sections/:uuid',
        httpMethod: 'PUT',
        middleware: [ensureAuthenticated, ensureAuthorized, SectionCtrl.updatebyId],
        accessLevel: accessLevels.superuser
    },
    {
        path: '/api/sections/:uuid',
        httpMethod: 'DELETE',
        middleware: [ensureAuthenticated, ensureAuthorized, SectionCtrl.removebyId],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/sections/:uuid/students',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, SectionCtrl.getStudents],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/sections/:uuid/teachers',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, SectionCtrl.getTeachers],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/sections/:uuid/schools',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, SectionCtrl.getSchools],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/sections/:uuid/units',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, SectionCtrl.getUnits],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/sections/:uuid/feeds/:flim',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, SectionCtrl.getFeeds],
        accessLevel: accessLevels.loggedin
    },
    //Unit resources
    {
        path: '/api/units/:uuid',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, UnitCtrl.getbyId],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/units/:uuid/archived',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, UnitCtrl.getArchived],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/units/:uuid/materials/:mid/:toArchive',
        httpMethod: 'PUT',
        middleware: [ensureAuthenticated, ensureAuthorized, UnitCtrl.updatebyId],
        accessLevel: accessLevels.loggedin
    },
    //Material resources
    {
        path: '/api/materials/:uuid',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, MaterialCtrl.getbyId],
        accessLevel: accessLevels.loggedin
    },
    //Problem resources
    {
        path: '/api/problems/:uuid',
        httpMethod: 'GET',
        middleware: [ensureAuthenticated, ensureAuthorized, ProblemCtrl.getbyId],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/problems/:uuid',
        httpMethod: 'POST',
        middleware: [ensureAuthenticated, ensureAuthorized, ProblemCtrl.savebyId],
        accessLevel: accessLevels.loggedin
    },
    {
        path: '/api/problems/:uuid',
        httpMethod: 'PUT',
        middleware: [ensureAuthenticated, ensureAuthorized, ProblemCtrl.updatebyId],
        accessLevel: accessLevels.loggedin
    },

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            var role = userRoles.public, username = '', id = '';
            if(req.user) {
                role = req.user.role;
                username = req.user.username;
                id = req.user.id;
            }
            res.cookie('user', JSON.stringify({
                'username': username,
                'role': role,
                'id': id
            }));
            res.render('index');
        }],
        accessLevel: accessLevels.public
    }
];

module.exports = function(app) {

    _.each(routes, function(route) {
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) return next();
    else                      return res.send(401);
}

function ensureAuthorized(req, res, next) {
    if(!req.user) return res.send(401);

    //console.log(req.user);
    var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;  //This look a bit fishy.
    if(!(accessLevel & req.user.role)) return res.send(403);

    return next();
}