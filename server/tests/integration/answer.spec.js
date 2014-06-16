/**
 * @fileOverview Integrated Server test
 * @module Test
 * @type {exports}
 */
require('amdefine/intercept');

var _ = require('underscore'),
    app = require('../../app.js'),
    data = require('./test.data.js'),
    sessionData = require('./session.data.js'),
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

describe('Answer API test - ', function (done) {
    var question = [];
    beforeEach(function () {
        passportStub.logout(); // logout before each test
    });
    afterEach(function () {
        passportStub.logout(); // logout after each test
    });
    var session1;
    it('add a session', function (done) {
        request(app).post('/api/sessions').send(sessionData.sessions[1]).expect(201).end(function (err, res) {
            session1 = res.body;
            session1.name.should.be.eql(sessionData.sessions[1].name);
            data.questionCreate.sessions = [session1._id];
            done();
        });
    });
    it('create question', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions').send(data.questionCreate).expect(201).end(function (err, res) {
            question = res.body;
            res.headers.location.split('/').slice(1,3).should.be.eql(['api', 'questions']);
            done();
        });
    });
    it('add answer to question', function (done) {
        var ansText = '我是一个有趣的答案。你看得到我吗？';
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question._id + '/answers')
            .send(
                {text: ansText}
            )
            .expect(201).end(function (err, res){
                res.body.answers.slice(-1)[0].should.containEql({text: ansText});
                question.answers = res.body.answers;
                done();
             });
    });
    it('update answer in a question', function (done) {
        var ansText = '这是更新后的答案，请查收';
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question._id + '/answers/' + question.answers[0].id)
            .send({reason: 'test answer update', text: ansText})
            .expect(201).end(function (err, res){
                res.body.answers[0].text.should.eql(ansText);
                res.body.answers[0].edits.length.should.be.eql(1);
                done();
            });
    });
    it('check questionFeed record after answer update', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).get('/api/questions/' + question._id + '/answers/' + question.answers[0].id + '/feeds').expect(200).end(function (err, res) {
            console.log(res.body);
            res.body.questionId.should.eql(question._id);
            res.body.answerId.should.eql(question.answers[0].id);
            res.body.feeds.length.should.be.eql(1 + 1);// plus 1 for initial answer add.
            done();
        });
    });
    it('upvote answer', function (done) {
        var query = {
            voteup: 'true'
        };
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question._id + '/answers/' + question.answers[0].id + '/votes')
            .send(query)
            .expect(201).end(function (err, res){
                res.body.answers[0].voteup.should.containEql(studentUser.username);
                res.body.answers[0].votedown.should.not.containEql(studentUser.username);
                done();
            });
    });
    it('upvote answer again to remove vote', function (done) {
        var query = {
            voteup: 'true'
        };
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question._id + '/answers/' + question.answers[0].id + '/votes')
            .send(query)
            .expect(201).end(function (err, res){
                res.body.answers[0].voteup.should.not.containEql(studentUser.username);
                res.body.answers[0].votedown.should.not.containEql(studentUser.username);
                done();
            });
    });
    it('downvote answer', function (done) {
        var query = {
            votedown: 'true'
        };
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question._id + '/answers/' + question.answers[0].id + '/votes')
            .send(query)
            .expect(201).end(function (err, res){
                res.body.answers[0].votedown.should.containEql(studentUser.username);
                res.body.answers[0].voteup.should.not.containEql(studentUser.username);
                done();
            });
    });
    it('downvote answer again to remove downvote', function (done) {
        var query = {
            votedown: 'true'
        };
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question._id + '/answers/' + question.answers[0].id + '/votes')
            .send(query)
            .expect(201).end(function (err, res){
                res.body.answers[0].votedown.should.not.containEql(studentUser.username);
                res.body.answers[0].voteup.should.not.containEql(studentUser.username);
                done();
            });
    });
    it('delete answer in a question', function (done) {
        var originalLength = _.size(question.answers);
        passportStub.login(studentUser);
        request(app).del('/api/questions/' + question._id + '/answers/' + question.answers[0].id)
            .expect(201).end(function (err, res){
                _.size(res.body.answers).should.eql(originalLength-1);
                done();
            });
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
