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

describe('Comment API test - ', function (done) {
    var question = {};
    beforeEach(function () {
        passportStub.logout(); // logout before each test
    });
    afterEach(function () {
        passportStub.logout(); // logout after each test
    });
    it('create question', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/questions').send(data.questionCreate).expect(201).end(function (err, res) {
            question = res.body;
            res.headers.location.split('/').slice(1,3).should.be.eql(['api', 'questions']);
            done();
        });
    });
    it('add comment to question', function (done) {
        var commentText = '我是一个有趣的答案。你看得到我吗？';
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question.id + '/comments')
            .send(
                {text: commentText}
            )
            .expect(201).end(function (err, res){
                res.body.comments.slice(-1)[0].should.containEql({text: commentText});
                question.comments = res.body.comments;
                done();
             });
    });
    it('update comment in a question', function (done) {
        var comment = '这是更新后的答案，请查收';
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question.id + '/comments/' + question.comments[0].id)
            .send({text: comment})
            .expect(201).end(function (err, res){
                res.body.comments[0].text.should.eql(comment);
                done();
            });
    });
    it('upvote comment ', function (done) {
        var query = {
            voteup: 'true'
        };
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question.id + '/comments/' + question.comments[0].id)
            .send(query)
            .expect(201).end(function (err, res){
                res.body.comments[0].voteup.should.containEql(studentUser.username);
                res.body.comments[0].votedown.should.not.containEql(studentUser.username);
                done();
            });
    });
    it('upvote comment again to remove vote', function (done) {
        var query = {
            voteup: 'true'
        };
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question.id + '/comments/' + question.comments[0].id)
            .send(query)
            .expect(201).end(function (err, res){
                res.body.comments[0].voteup.should.not.containEql(studentUser.username);
                res.body.comments[0].votedown.should.not.containEql(studentUser.username);
                done();
            });
    });
    it('downvote comment', function (done) {
        var query = {
            votedown: 'true'
        };
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question.id + '/comments/' + question.comments[0].id)
            .send(query)
            .expect(201).end(function (err, res){
                res.body.comments[0].votedown.should.containEql(studentUser.username);
                res.body.comments[0].voteup.should.not.containEql(studentUser.username);
                done();
            });
    });
    it('downvote answer again to remove downvote', function (done) {
        var query = {
            votedown: 'true'
        };
        passportStub.login(studentUser);
        request(app).post('/api/questions/' + question.id + '/comments/' + question.comments[0].id)
            .send(query)
            .expect(201).end(function (err, res){
                res.body.comments[0].votedown.should.not.containEql(studentUser.username);
                res.body.comments[0].voteup.should.not.containEql(studentUser.username);
                done();
            });
    });
    it('delete answer in a question', function (done) {
        var originalLength = _.size(question.comments);
        passportStub.login(studentUser);
        request(app).del('/api/questions/' + question.id + '/comments/' + question.comments[0].id)
            .expect(201).end(function (err, res){
                _.size(res.body.comments).should.eql(originalLength-1);
                done();
            });
    });

});
