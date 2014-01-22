/**
 * @fileOverview Integrated Server test
 * @module Test
 * @type {exports}
 */
var app = require('../../../server'),
    data = require('./test.data.js'),
    express = require('express'),
    request = require('supertest'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    should = require('should'),
    passportStub = require('passport-stub'),
    userRoles = require('../../../client/js/rolesHelper.js').userRoles,
    accessLevels = require('../../../client/js/rolesHelper.js').accessLevels;

app.use(express.bodyParser());
passportStub.install(app);

var studentUser, parentUser, teacherUser, adminUser, superadminUser;

describe('Server Authentication Tests - ', function (done) {
    beforeEach(function() {
        passportStub.logout(); // logout after each test
    });
    afterEach(function() {
        passportStub.logout(); // logout after each test
    });

    it('/ - Return a 200. The root uri always return 200 and "index.html"', function(done) {
        request(app).get('/').expect(200, done);
    });
    it('/frontPage - Return a 200 The root uri always return 200 and "index.html"', function(done) {
        request(app).get('/frontPage').expect(200, done);
    });
    it('/user - Return a 200 The root uri always return 200 and "index.html"', function(done) {
        request(app).get('/user').expect(200, done);
    });
    it('/register - 200 student', function(done) {
        request(app).post('/register').send(data.studentRegister).expect(200, done);
    });
    it('/register - 200 parent', function(done) {
        request(app).post('/register').send(data.parentRegister).expect(200, done);
    });
    it('/register - 200 teacher', function(done) {
        request(app).post('/register').send(data.teacherRegister).expect(200, done);
    });
    it('/register - 200 admin', function(done) {
        request(app).post('/register').send(data.adminRegister).expect(200, done);
    });
    it('/register - 200 superadmin', function(done) {
        request(app).post('/register').send(data.superadminRegister).expect(200, done);
    });
    it('/login - student', function(done) {
        request(app)
            .post('/login')
            .send(data.studentLogin)
            .end(function (err, res){
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.student.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(data.studentLogin.username);
                studentUser = res.body;
                done();
            })
    });
    it('/login - parent', function(done) {
        request(app)
            .post('/login')
            .send(data.parentLogin)
            .end(function (err, res){
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.parent.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(data.parentLogin.username);
                parentUser = res.body;
                done();
            })
    });
    it('/login - teacher', function(done) {
        request(app)
            .post('/login')
            .send(data.teacherLogin)
            .end(function (err, res){
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.teacher.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(data.teacherLogin.username);
                teacherUser = res.body;
                done();
            })
    });
    it('/login - admin', function(done) {
        request(app)
            .post('/login')
            .send(data.adminLogin)
            .end(function (err, res){
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.admin.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(data.adminLogin.username);
                adminUser = res.body;
                done();
            })
    });
    it('/login - superadmin', function(done) {
        request(app)
            .post('/login')
            .send(data.superadminLogin)
            .end(function (err, res){
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.superadmin.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(data.superadminLogin.username);
                superadminUser = res.body;
                done();
            })
    });

});
describe('Server API Tests - ', function (done) {
    beforeEach(function() {
        passportStub.logout(); // logout after each test
    });
    afterEach(function() {
        passportStub.logout(); // logout after each test
    });
    it('/api/problems/all - return 401 when not logged in', function(done) {
        request(app).get('/api/problems/all').expect(401, done);
    });
    it('/api/errata/all - return 200 when logged in', function(done) {
        passportStub.login(studentUser); // login as user
//        console.log("studentUser object returned from the login");
//        console.log(studentUser);
        request(app).get('/api/problems/all').expect(200, done);
    });
//    it('/api/problems/all - return 200 when logged in', function(done) {
//        passportStub.login(admin); // login as admin
//        request(app).get('/api/problems/all').expect(200, done);
//    });
});

// =============== Example Code ===============
//
//    it('/login - Return a 200 and a user object', function(done) {
//        request(app)
//            .post('/login')
//            .send(student)
//            .expect(200,
//                {
//                 role: 2,
//                 username: 'student1',
//                 id: '5292f0e8c66c90aa29000016'
//                }
//                , done)
//    });
//    it('/login - second way to check', function(done) {
//        request(app)
//            .post('/login')
//            .send(student)
//            .end(function (err, res){
//                if (err) return done(err);
//                "use strict";
//                res.body.role.should.equal(2);
//                done();
//            })
//    });
//    it('/login - third way to check', function(done) {
//        request(app)
//            .post('/login')
//            .send(student)
//            .end(function (err, res){
//                if (err) return done(err)
//                expect(res.body.username).to.eql(student1.username);
//                done();
//            });
//    });
//    it('Logout - Return a 200', function(done) {
//        request(app).post('/logout').expect(200, done);
//    });
//    it('As a Logout user, on /users - Return a 403', function(done) {
//        request(app).get('/users').expect(403, done);
//    });
//    it('Register a new user(no role) - Return a 400', function(done) {
//        request(app).post('/register').send(user2).expect(400, done);
//    });
//    it('Register a new user - Return a 200', function(done) {
//        request(app).post('/register').send(user).expect(200, done);
//    });
//    it('As a normal user, on /users - Return a 403', function(done) {
//        passportStub.login(user); // login as user
//        request(app).get('/users').expect(403, done);
//    });
//    it('Login as Admin - Return a 200', function(done) {
//        request(app).post('/login').send(admin).expect(200, done);
//    });
//    it('As a Admin user, on /users - Return a 200', function(done) {
//        passportStub.login(admin); // login as admin
//        request(app).get('/users').expect(200, done);
//    });
//    it('/login - Return a 200 and a user object', function(done) {
//        request(app)
//            .post('/login')
//            .send(student)
//            .expect(200,
//                {
//                 role: 2,
//                 username: 'student1',
//                 id: '5292f0e8c66c90aa29000016'
//                }
//                , done)
//    });
//    it('/login - second way to check', function(done) {
//        request(app)
//            .post('/login')
//            .send(student)
//            .end(function (err, res){
//                if (err) return done(err);
//                "use strict";
//                res.body.role.should.equal(2);
//                done();
//            })
//    });
//    it('/login - third way to check', function(done) {
//        request(app)
//            .post('/login')
//            .send(student)
//            .end(function (err, res){
//                if (err) return done(err)
//                expect(res.body.username).to.eql(student1.username);
//                done();
//            });
//    });
//    it('Logout - Return a 200', function(done) {
//        request(app).post('/logout').expect(200, done);
//    });
//    it('As a Logout user, on /users - Return a 403', function(done) {
//        request(app).get('/users').expect(403, done);
//    });
//    it('Register a new user(no role) - Return a 400', function(done) {
//        request(app).post('/register').send(user2).expect(400, done);
//    });
//    it('Register a new user - Return a 200', function(done) {
//        request(app).post('/register').send(user).expect(200, done);
//    });
//    it('As a normal user, on /users - Return a 403', function(done) {
//        passportStub.login(user); // login as user
//        request(app).get('/users').expect(403, done);
//    });
//    it('Login as Admin - Return a 200', function(done) {
//        request(app).post('/login').send(admin).expect(200, done);
//    });
//    it('As a Admin user, on /users - Return a 200', function(done) {
//        passportStub.login(admin); // login as admin
//        request(app).get('/users').expect(200, done);
//    });
