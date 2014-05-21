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
        passportStub.logout(); // logout after each test
    });
    afterEach(function () {
        passportStub.logout(); // logout after each test
    });
    it("doesn't need to login to access", function (done) {
        request(app).get('/api/books/' + studentUser.username).expect(200, done);
    });
    it('add a book', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/books').send(bookData.book).expect(201).end(function (err, res) {
            book = res.body;
            done();
        });
    });
    it('update book', function (done) {
        passportStub.login(studentUser); // login as user
        book.title = 'Your Inner Fish';
        request(app).post('/api/books/' + book._id).send(book).expect(201).end(function (err, res) {
            BookUpdated = res.body;
            BookUpdated.title.should.be.eql(book.title);
            done();
        });
    });
});

