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

describe('Book API test - ', function (done) {
    beforeEach(function () {
        passportStub.logout(); // logout after each test
    });
    afterEach(function () {
        passportStub.logout(); // logout after each test
    });
    it("doesn't need to login to access", function (done) {
        request(app).get('/api/books/' + studentUser.username).expect(200, done);
    });
    it('update book', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/books/' + studentUser.username).send(data.bookInfo).expect(201).end(function (err, res) {
            question = res.body;
//            res.headers.location.split('/').slice(1,3).should.be.eql(['api', 'questions']);
            done();
        });
    });
//    it('create another question', function (done) {
//        passportStub.login(superadminUser); // login as user
//        request(app).post('/api/questions').send(data.questionCreate2).expect(201).end(function (err, res) {
//            question2 = res.body;
//            res.headers.location.split('/').slice(1,3).should.be.eql(['api', 'questions']);
//            done();
//        });
//    });
//    it('create question as superadmin', function (done) {
//        passportStub.login(superadminUser); // login as user
//        request(app).post('/api/questions').send(data.questionCreate2).expect(201, done);
//    });
//    it("doesn't need to login to access", function (done) {
//        request(app).get('/api/questions').expect(200, done);
//    });
//    it('get questions', function (done) {
//        passportStub.login(studentUser); // login as user
//        request(app).get('/api/questions').expect(200).end(function (err, res) {
//            _.size(res.body).should.be.greaterThan(0);
//            done();
//        });
//    });
//    it("doesn't need to login to access", function (done) {
////        console.log('show the question before using it to access');
////        console.log(question);
//        request(app).get('/api/questions/' + question.id).expect(200, done);
//    });
//    it('get question by Id', function (done) {
//        passportStub.login(studentUser); // login as user
//        request(app).get('/api/questions/' + question.id).expect(200).end(function (err, res){
//            res.body.id.should.eql(question.id);
//            done();
//        });
//    });
//    it('needs to login to access', function (done) {
////        console.log('I am actually here')
//        passportStub.logout(); // logout after each test
//        request(app).post('/api/questions/' + question.id).send({}).expect(401, done);
//    });
//    it('update question title by Id', function (done) {
//        passportStub.login(studentUser); // login as user
//        request(app).post('/api/questions/' + question.id).send({title: 'updatedTitle'}).expect(201).end(function (err, res){
//            res.body.title.should.eql('updatedTitle');
//            done();
//        });
//    });
//    it('update question text by Id', function (done) {
//        passportStub.login(studentUser); // login as user
//        request(app).post('/api/questions/' + question.id).send({text: 'updatedText'}).expect(201).end(function (err, res){
//            res.body.text.should.eql('updatedText');
//            done();
//        });
//    });
//    it('update question tags by Id', function (done) {
//        passportStub.login(studentUser); // login as user
//        request(app).post('/api/questions/' + question.id).send({tags: ['updated tag 1', 'updated tag 2', 'updated tag 3']}).expect(201).end(function (err, res){
//            res.body.tags.should.eql(['updated tag 1', 'updated tag 2', 'updated tag 3']);
//            done();
//        });
//    });
//    it('needs to login to delete', function (done) {
//        request(app).del('/api/questions/' + question.id).expect(401, done);
//    });
//    it('delete question by Id', function (done) {
//        passportStub.login(studentUser); // login as user
//        request(app).del('/api/questions/' + question.id).expect(204, done);
//    });
//    it('upvote the question2', function (done) {
//        passportStub.login(studentUser); // login as user
//        request(app).post('/api/questions/' + question2.id).send({voteup: 'true'}).expect(201).end(function (err, res){
//            res.body.voteup.should.containEql(studentUser.username);
//            done();
//        });
//    });
//    it('downvote the question2', function (done) {
//        passportStub.login(studentUser); // login as user
//        request(app).post('/api/questions/' + question2.id).send({votedown: 'true'}).expect(201).end(function (err, res){
//            res.body.votedown.should.containEql(studentUser.username);
//            done();
//        });
//    });
//    it('upvote the question2 again', function (done) {
//        passportStub.login(studentUser); // login as user
//        request(app).post('/api/questions/' + question2.id).send({voteup: 'true'}).expect(201, done);
//    });
//    it('remove upvote from question2', function (done) {
//        passportStub.login(studentUser); // login as user
//        request(app).post('/api/questions/' + question2.id).send({voteup: 'true'}).expect(201).end(function (err, res){
//            res.body.voteup.should.not.containEql(studentUser.username);
//            done();
//        });
//    });
});

