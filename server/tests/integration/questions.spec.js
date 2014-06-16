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

describe('Question API test - ', function (done) {
    beforeEach(function () {
        passportStub.logout(); // logout after each test
    });
    afterEach(function () {
        passportStub.logout(); // logout after each test
    });
    it("can't search without parameters", function (done) {
        request(app).get('/api/questions/').expect(400, done);
    });
    it("doesn't need to login to access", function (done) {
        request(app).get('/api/questions/?search=true').expect(200, done);
    });
    var question = {};
    var question2 = {};
    it('create question', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions').send(data.questionCreate).expect(201).end(function (err, res) {
            question = res.body;
            res.headers.location.split('/').slice(1, 3).should.be.eql(['api', 'questions']);
            done();
        });
    });
    it('create another question', function (done) {
        passportStub.login(superadminUser); // login as user
        request(app).post('/api/questions').send(data.questionCreate2).expect(201).end(function (err, res) {
            question2 = res.body;
            // console.log('now showing question2');
            // console.log(question2);
            res.headers.location.split('/').slice(1, 3).should.be.eql(['api', 'questions']);
            done();
        });
    });
    it('create question as superadmin', function (done) {
        passportStub.login(superadminUser); // login as user
        request(app).post('/api/questions').send(data.questionCreate2).expect(201, done);
    });
    it('get questions', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).get('/api/questions/?authorUsername=' + studentUser.username).expect(200).end(function (err, res) {
            _.size(res.body).should.be.greaterThan(0);
            done();
        });
    });
    it("doesn't need to login to access", function (done) {
//        console.log('show the question before using it to access');
//        console.log(question);
        request(app).get('/api/questions/' + question._id).expect(200, done);
    });
    it('get question by Id', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).get('/api/questions/' + question._id).expect(200).end(function (err, res) {
            res.body._id.should.eql(question._id);
            done();
        });
    });
    it('needs to login to access', function (done) {
//        console.log('I am actually here')
        passportStub.logout(); // logout after each test
        request(app).post('/api/questions/' + question._id).send({}).expect(401, done);
    });
    it('update question title by Id', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions/' + question._id).send({reason: 'testing this', title: 'updatedTitle'}).expect(201).end(function (err, res) {
            res.body.title.should.eql('updatedTitle');
            res.body.edits.length.should.be.greaterThan(0);
            res.body.edits.length.should.be.eql(1);
            done();
        });
    });
    it('update question text by Id', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions/' + question._id).send({reason: 'testing this', text: 'updatedText'}).expect(201).end(function (err, res) {
            res.body.text.should.eql('updatedText');
            res.body.edits.length.should.be.eql(2);
            done();
        });
    });
    it('update question tags by Id', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions/' + question._id).send({reason: 'testing tag updates', tags: ['updated tag 1', 'updated tag 2', 'updated tag 3']}).expect(201).end(function (err, res) {
            res.body.tags.should.eql(['updated tag 1', 'updated tag 2', 'updated tag 3']);
            res.body.edits.length.should.be.eql(3);
            done();
        });
    });
    it('check questionFeed record!', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).get('/api/questions/' + question._id + '/feeds').expect(200).end(function (err, res) {
            console.log(res.body);
            res.body.questionId.should.eql(question._id);
            res.body.feeds.length.should.be.eql(3 + 1);//plus initial question add.
            done();
        });
    });
    it('needs to login to delete', function (done) {
        request(app).del('/api/questions/' + question._id).expect(401, done);
    });
    it('delete question by Id', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).del('/api/questions/' + question._id).expect(204, done);
    });
    it('upvote the question2', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions/' + question2._id + '/votes').send({voteup: 'true'}).expect(201).end(function (err, res) {
            res.body.voteup.should.containEql(studentUser.username);
            done();
        });
    });
    it('downvote the question2', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions/' + question2._id + '/votes').send({votedown: 'true'}).expect(201).end(function (err, res) {
            res.body.votedown.should.containEql(studentUser.username);
            done();
        });
    });
    it('upvote the question2 again', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions/' + question2._id + '/votes').send({voteup: 'true'}).expect(201, done);
    });
    it('remove upvote from question2', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions/' + question2._id + '/votes').send({voteup: 'true'}).expect(201).end(function (err, res) {
            res.body.voteup.should.not.containEql(studentUser.username);
            done();
        });
    });
});

