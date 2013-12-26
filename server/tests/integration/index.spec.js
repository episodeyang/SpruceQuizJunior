var app = require('../../../server'),
    request = require('supertest'),
    expect = require('expect.js'),
    should = require('should'),
    passportStub = require('passport-stub');

passportStub.install(app);

// user account
var user = {
    'username':'newUser',
    'role':{bitMask: 2,title: "user"},
    'password':'12345'
};

// user account 2 - no role
var user2 = {
    'username':'newUser',
    'password':'12345'
};

// admin account
var student = {
    'username':'student1',
    'role': { bitMask: 2, title: 'student' },
    'id': '2',
    'password': '123'
};
// student account
var student = {
    'username':'student1',
    'password': '123',
    'rememberme': 'true'
};

describe('Server Integration Tests - ', function (done) {
    afterEach(function() {
        passportStub.logout(); // logout after each test
    });
    it('/ - Return a 200', function(done) {
        request(app).get('/').expect(200, done);
    });
    it('/frontPage - Return a 200', function(done) {
        request(app).get('/frontPage').expect(200, done);
    });
    it('/login - Return a 200 and a user object', function(done) {
        request(app)
            .post('/login')
            .send(student)
            .expect(200,
                {
                 role: 2,
                 username: 'student1',
                 id: '5292f0e8c66c90aa29000016'
                }
                , done)
    });
    it('/login - second way to check', function(done) {
        request(app)
            .post('/login')
            .send(student)
            .end(function (err, res){
                if (err) return done(err);
                "use strict";
                res.body.role.should.equal(2);
                done();
            })
    });
    it('/login - third way to check', function(done) {
        request(app)
            .post('/login')
            .send(student)
            .end(function (err, res){
                if (err) return done(err)
                expect(res.body.username).to.eql(student1.username);
                done();
            });
    });

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
});
