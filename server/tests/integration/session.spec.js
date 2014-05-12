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
        request(app).get('/api/sessions/'+session0._id).expect(200).end(function (err, res) {
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
            res.body.sessions.should.containDeep([{_id: session0._id}]);
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
            res.body.sessions.should.containDeep([{_id: session1._id}]);
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
            res.body.sessions.should.not.containDeep([{_id: session1._id}]);
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
            res.body.sessions.should.containDeep([{_id: session1._id}]);
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
            res.body.sessions.should.containDeep([{_id: session2._id}]);
            done();
        });
    });
//    it('add a session to user', function (done) {
//    });
});

