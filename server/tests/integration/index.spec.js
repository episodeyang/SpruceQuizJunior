var app = require('../../../server'),
    express = require('express')
    request = require('supertest'),
    expect = require('expect.js'),
    should = require('should'),
    passportStub = require('passport-stub'),
    userRoles = require('../../../client/js/rolesHelper.js').userRoles,
    accessLevels = require('../../../client/js/rolesHelper.js').accessLevels;

app.use(express.bodyParser());
passportStub.install(app);

//request = request('http://localhost:8000')

// student account
var student = {
    'username':'student1',
    'password': '123',
    'rememberme': 'true'
};
var student2 = {
    username: 'student1',
    role: userRoles.student,
    id: '52c0ce02030a77a92000001b'
};

var student3 = {
    username: 'student1',
    password: 'passwordConfirm',
    role: '2',
    school: '',
    rawNamText: '',
    dataOfBirth: ''
};
var admin = {
    'username':'admin',
    'password': '123',
    'rememberme': 'true'
};

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
    it('/user- Return a 200 The root uri always return 200 and "index.html"', function(done) {
        request(app).get('/user').expect(200, done);
    });

    it('/login - student1', function(done) {
        request(app)
            .post('/login')
            .send(student)
            .end(function (err, res){
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.student.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(student.username);
                studentUser = res.body;
                done();
            })
    });
    it('/login - admin', function(done) {
        request(app)
            .post('/login')
            .send(admin)
            .end(function (err, res){
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.admin.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(admin.username);
                done();
            })
    });
    it('/register - admin', function(done) {
        var newStudent = {
            username: 'newStudent',
            password: 'password',
            role: userRoles.student,
            schoolName: '北京景山学校',
            firstName: 'Ge',
            lastName: 'Yang',
            birthDay: new Date(2013, 12, 1, 9, 0, 0)
        };
        request(app)
            .post('/register')
            .send(newStudent)
            .end(function (err, res){
                if (err) return done(err);
                "use strict";

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
        console.log("studentUser object returned from the login");
        console.log(studentUser);
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
