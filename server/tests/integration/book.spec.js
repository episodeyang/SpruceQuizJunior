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
    bookData = require('./book.data.js'),
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

var book, bookUpdated;
describe('Book API test - ', function (done) {
    beforeEach(function () {
        passportStub.login(studentUser); // login as user
    });
    afterEach(function () {
        passportStub.logout(); // logout after each test
    });
    it("doesn't need to login to access", function (done) {
        passportStub.logout(); // logout after each test
        request(app).get('/api/books').expect(200, done);
    });
    it('add a book', function (done) {
        request(app).post('/api/books').send(bookData.book).expect(201).end(function (err, res) {
            book = res.body;
            console.log(book);
            book.title.should.be.eql(bookData.book.title);
            book.authors[0].name.should.be.eql(bookData.book.authors[0].name);
            done();
        });
    });
    it("doesn't need to login to access", function (done) {
        passportStub.logout(); // logout after each test
        request(app).get('/api/books/' + book._id).expect(200, done);
    });
    it('get a book via id', function (done) {
        request(app).get('/api/books/' + book._id).expect(200).end(function (err, res) {
            book = res.body;
            book.title.should.be.eql(bookData.book.title);
            book.authors[0].name.should.be.eql(bookData.book.authors[0].name);
            done();
        });
    });
    it('get a book via title', function (done) {
        request(app).get('/api/books?title=' + book.title).expect(200).end(function (err, res) {
            book = res.body[0];
            book.title.should.be.eql(bookData.book.title);
            book.authors[0].name.should.be.eql(bookData.book.authors[0].name);
            done();
        });
    });
    it('get a book via author and title', function (done) {
        request(app).get('/api/books?authorName=' + book.authors[0].name + 'title=' + book.title).expect(200).end(function (err, res) {
            book = res.body[0];
            book.title.should.be.eql(bookData.book.title);
            book.authors[0].name.should.be.eql(bookData.book.authors[0].name);
            done();
        });
    });
//    });
    it('update book', function (done) {
        book.title = 'Your Inner Fish';
        request(app).post('/api/books/' + book._id).send(book).expect(201).end(function (err, res) {
            BookUpdated = res.body;
            BookUpdated.title.should.be.eql(book.title);
            done();
        });
    });
    var question = {};
    it('get quesitons id\'s', function (done) {
        request(app).get('/api/questions/?search=true').expect(200).end(function (err, res) {
            console.log(res.body);
            question = res.body[0];
            done();
        });
    });
//    it('add question to book and get the question populated on it\'s way back', function (done) {
//        var query = {
//            add: {
//                id: question._id
//            }
//        };
//        request(app).post('/api/books/' + book._id + '/questions').send(query).expect(201).end(function (err, res) {
//            res.body.questions.should.containDeep([{_id: question._id}]);
//            done();
//        });
//    });
//    it('pull question from book', function (done) {
//        var query = {
//            pull: {
//                id: question._id
//            }
//        };
//        request(app).post('/api/books/' + book._id + '/questions').send(query).expect(201).end(function (err, res) {
//            res.body.questions.should.not.containDeep([{id: question._id}]);
//            done();
//        });
//    });
    var question;
    it('create new question with book', function (done) {
        "use strict";
        question = data.questionCreate;
        question.books = [BookUpdated];
        request(app).post('/api/questions').send(question).expect(201).end(function (err, res) {
            console.log(BookUpdated);
            console.log(res.body);
            res.body.books.should.containDeep([{title: BookUpdated.title}]);
            question = res.body;
            done();
        });
    });
//    it('now get the book to check if the question is there.', function (done) {
//        request(app).get('/api/books/' + BookUpdated._id).expect(200).end(function (err, res) {
//            console.log(res.body);
//            res.body.questions.should.containDeep([{_id:question._id}]);
//            done();
//        });
//    });
});

