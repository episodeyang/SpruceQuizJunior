/**
 * @fileOverview Integrated Server test
 * @module Test
 * @type {exports}
 */
require('amdefine/intercept');

var _ = require('underscore'),
    app = require('../../app.js'),
    data = require('./test.data.js'),
    data2 = require('./school.data.js'),
    sessionData = require('./session.data.js'),
    express = require('express'),
    request = require('supertest'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    should = require('should'),
    passportStub = require('../../lib/passport-stub.js'),//the modified version of passport-stub, for the newer interface.
    userRoles = require('../../../client/js/rolesHelper.js').userRoles,
    accessLevels = require('../../../client/js/rolesHelper.js').accessLevels;

_.extend(data, data2);

app.use(express.bodyParser());
passportStub.install(app);

var studentUser = data.studentUser,
    parentUser = data.parentUser,
    teacherUser = data.teacherUser,
    adminUser = data.adminUser,
    superadminUser = data.superadminUser;

var session0, session1, session2, sessionUpdated;
describe('Session API test - ', function (done) {
    beforeEach(function () {
        passportStub.login(studentUser); // login as user
    });
    afterEach(function () {
        passportStub.logout(); // logout after each test
    });
    it("doesn't need to login to access", function (done) {
        passportStub.logout(); // logout after each test
        request(app).get('/api/sessions').expect(200, done);
    });
    it('add a session', function (done) {
        request(app).post('/api/sessions').send(sessionData.sessions[0]).expect(201).end(function (err, res) {
            session0 = res.body;
            session0.name.should.be.eql(sessionData.sessions[0].name);
            done();
        });
    });
    it('add a session', function (done) {
        request(app).post('/api/sessions').send(sessionData.sessions[1]).expect(201).end(function (err, res) {
            session1 = res.body;
            session1.name.should.be.eql(sessionData.sessions[1].name);
            done();
        });
    });
    it('add a session', function (done) {
        request(app).post('/api/sessions').send(sessionData.sessions[2]).expect(201).end(function (err, res) {
            session2 = res.body;
            session2.name.should.be.eql(sessionData.sessions[2].name);
            done();
        });
    });
    it('get a session', function (done) {
        request(app).get('/api/sessions/' + session0._id).expect(200).end(function (err, res) {
            sessionData.sessions[0].name.should.be.eql(res.body.name);
            done();
        });
    });
    it('update session', function (done) {
        session0.name = '生物（三年级一班）';
        session0.tags.push('化学');
        session0.school = '北京景山学校';
        request(app).post('/api/sessions/' + session0._id).send(session0).expect(201).end(function (err, res) {
            sessionUpdated = res.body;
            sessionUpdated.name.should.be.eql(session0.name);
            sessionUpdated.tags.should.containEql('化学');
            done();
        });
    });
    it('add a session to user', function (done) {
        var query = {
            add: {
                _id: session0._id
            }
        };
        request(app).post('/api/users/' + studentUser.username + '/sessions').send(query).expect(201).end(function (err, res) {
            res.body.sessions.should.containDeep([
                {_id: session0._id}
            ]);
            done();
        });
    });
    it('add another session to user', function (done) {
        var query = {
            add: {
                _id: session1._id
            }
        };
        request(app).post('/api/users/' + studentUser.username + '/sessions').send(query).expect(201).end(function (err, res) {
            res.body.sessions.should.containDeep([
                {_id: session1._id}
            ]);
            done();
        });
    });
    it('remove this session from user', function (done) {
        var query = {
            remove: {
                _id: session1._id
            }
        };
        request(app).post('/api/users/' + studentUser.username + '/sessions').send(query).expect(201).end(function (err, res) {
            res.body.sessions.should.not.containDeep([
                {_id: session1._id}
            ]);
            done();
        });
    });
    it('add another session to user', function (done) {
        var query = {
            add: {
                _id: session1._id
            }
        };
        request(app).post('/api/users/' + studentUser.username + '/sessions').send(query).expect(201).end(function (err, res) {
            res.body.sessions.should.containDeep([
                {_id: session1._id}
            ]);
            done();
        });
    });
    it('add another session to user', function (done) {
        var query = {
            add: {
                _id: session2._id
            }
        };
        request(app).post('/api/users/' + studentUser.username + '/sessions').send(query).expect(201).end(function (err, res) {
            res.body.sessions.should.containDeep([
                {_id: session2._id}
            ]);
            done();
        });
    });
    var questions;
    var question;
    it('create new question with sessionId', function (done) {
        "use strict";
        question = data.questionCreate;
        question.sessions = [session0._id];
        request(app).post('/api/questions').send(question).expect(201).end(function (err, res) {
            res.body.sessions.should.containEql(session0._id);
            question = res.body;
            done();
        });
    });
    it('now get questions from the session', function (done) {
        request(app).get('/api/sessions/' + session0._id + '/questions').expect(200).end(function (err, res) {
            res.body.should.containDeep([
                {_id: question._id}
            ]);
            done();
        });
    });
//    it('now get session to check if the question is there.', function (done) {
//        request(app).get('/api/sessions/' + session0._id).expect(200).end(function (err, res) {
//            console.log(res.body);
//            res.body.questions.should.containEql(question._id);
//            done();
//        });
//    });
    it('get quesitons id\'s', function (done) {
        request(app).get('/api/questions/?authorUsername=' + studentUser.username).expect(200).end(function (err, res) {
            console.log(res.body);
            questions = res.body;
            done();
        });
    });
//    it('add question to session and get the question populated on it\'s way back', function (done) {
//        var query = {
//            add: {
//                _id: questions[0]._id
//            }
//        };
//        request(app).post('/api/sessions/' + session2._id + '/questions').send(query).expect(201).end(function (err, res) {
//            res.body.questions.should.containDeep([
//                {_id: questions[0]._id}
//            ]);
//            done();
//        });
//    });
    // the get session api does not contain populated sessions field.
//    it('pull question from session', function (done) {
//        var query = {
//            pull: {
//                _id: questions[0]._id
//            }
//        };
//        request(app).post('/api/sessions/' + session2._id + '/questions').send(query).expect(201).end(function (err, res) {
//            res.body.questions.should.not.containDeep([
//                {_id: questions[0]._id}
//            ]);
//            done();
//        });
//    });
    var book = {
        title: "你身体里的那条鱼",
        authors: [
            {name: 'schubin,Neil'}
        ],
        coverUrl: 'http://douban.com/34523452.jpg'
    };
    it('add books to a session via /api/session{POST}', function (done) {
        var query = {
            books: [book]
        };
        request(app).post('/api/sessions/' + session2._id).send(query).expect(201).end(function (err, res) {
            res.body.books.should.containDeep([
                {title: query.books[0].title}
            ]);
            done();
        });
    });
    it('remove the book from a session via the session/books API', function (done) {
        // query works, as long as the authors field with
        // is an array is not included.
        var query = {
            pull: {
                title: book.title,
                coverUrl: book.coverUrl
            }
        };
        request(app).post('/api/sessions/' + session2._id + '/books').send(query).expect(201).end(function (err, res) {
            res.body.books.should.not.containDeep([
                {title: book.title}
            ]);
            console.log(res.body);
            done();
        });
    });
    it('add the book back to the session via the session/books API', function (done) {
        var query = {
            add: book
        };
        request(app).post('/api/sessions/' + session2._id + '/books').send(query).expect(201).end(function (err, res) {
            res.body.books.should.containDeep([
                {title: book.title}
            ]);
            console.log(res.body);
            done();
        });
    });
});

