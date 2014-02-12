/**
 * @fileOverview Integrated Server test
 * @module Test
 * @type {exports}
 */
require('amdefine/intercept');

var _ = require('underscore'),
    app = require('../../app.js'),
    data = require('./test.data.js'),
    express = require('express'),
    request = require('supertest'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    should = require('should'),
    passportStub = require('../../lib/passport-stub.js'),//the modified version of passport-stub, for the newer interface.
    userRoles = require('../../../client/js/rolesHelper.js').userRoles,
    accessLevels = require('../../../client/js/rolesHelper.js').accessLevels;

app.use(express.bodyParser());
passportStub.install(app);

var studentUser = data.studentUser,
    parentUser = data.parentUser,
    teacherUser = data.teacherUser,
    adminUser = data.adminUser,
    superadminUser = data.superadminUser;

describe('Server API Tests - ', function (done) {
    beforeEach(function () {
        passportStub.logout(); // logout after each test
    });
    afterEach(function () {
        passportStub.logout(); // logout after each test
    });
    it('needs to login to access', function (done) {
        request(app).get('/api/questions').expect(401, done);
    });
    var question = {};
    var question2 = {};
    it('create question', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions').send(data.questionCreate).expect(201).end(function (err, res) {
            question = res.body;
            res.headers.location.split('/').slice(1,3).should.be.eql(['api', 'questions']);
            done();
        });
    });
    it('create another question', function (done) {
        passportStub.login(superadminUser); // login as user
        request(app).post('/api/questions').send(data.questionCreate2).expect(201).end(function (err, res) {
            question2 = res.body;
            res.headers.location.split('/').slice(1,3).should.be.eql(['api', 'questions']);
            done();
        });
    });
    it('create question as superadmin', function (done) {
        passportStub.login(superadminUser); // login as user
        request(app).post('/api/questions').send(data.questionCreate2).expect(201, done);
    });
    it('needs to login to access', function (done) {
        request(app).get('/api/questions').expect(401, done);
    });
    it('get questions', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).get('/api/questions').expect(200).end(function (err, res) {
            _.size(res.body).should.be.greaterThan(0);
            done();
        });
    });
    it('needs to login to access', function (done) {
//        console.log('show the question before using it to access');
//        console.log(question);
        request(app).get('/api/questions/' + question.id).expect(401, done);
    });
    it('get question by Id', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).get('/api/questions/' + question.id).expect(200).end(function (err, res){
            res.body.id.should.eql(question.id);
            done();
        });
    });
    it('needs to login to access', function (done) {
        request(app).post('/api/questions/' + question.id).expect(401, done);
    });
    it('update question by Id', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions/' + question.id).send({title: 'updatedTitle'}).expect(201).end(function (err, res){
            res.body.title.should.eql('updatedTitle');
            done();
        });
    });
    it('upvote the question2', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions/' + question2.id).send({voteup: 'true'}).expect(201).end(function (err, res){
            res.body.voteup.should.containDeep([studentUser.username]);
            done();
        });
    });
    it('downvote the question2', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions/' + question2.id).send({votedown: 'true'}).expect(201).end(function (err, res){
            res.body.votedown.should.containDeep([studentUser.username]);
            done();
        });
    });
    it('needs to login to delete', function (done) {
        request(app).del('/api/questions/' + question.id).expect(401, done);
    });
    it('update question by Id', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).del('/api/questions/' + question.id).send({title: 'updatedTitle'}).expect(204, done);
    });
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
