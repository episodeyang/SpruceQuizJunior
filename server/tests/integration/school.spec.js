/**
 * @fileOverview Integrated Server test
 * @module Test
 * @type {exports}
 */
require('amdefine/intercept');

var _ = require('underscore'),
    app = require('../../app.js'),
    data = require('./test.data.js'),
    schoolData = require('./school.data.js'),
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

var school, schoolUpdated;
describe('School API test - ', function (done) {
    beforeEach(function () {
        passportStub.logout(); // logout after each test
    });
    afterEach(function () {
        passportStub.logout(); // logout after each test
    });
    it("doesn't need to login to access", function (done) {
        request(app).get('/api/schools').expect(200, done);
    });
    it('add a school', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).post('/api/schools').send(schoolData.schools[0]).expect(201).end(function (err, res) {
            school = res.body;
            console.log(school);
            school.name.should.be.eql(schoolData.schools[0].name);
            done();
        });
    });
    it('get a school', function (done) {
        passportStub.login(studentUser); // login as user
        request(app).get('/api/schools/' + school.name).expect(200).end(function (err, res) {
            schoolData.schools[0].name.should.be.eql(res.body.name);
            console.log(res.body);
            done();
        });
    });
    it('update school', function (done) {
        passportStub.login(studentUser); // login as user
        school.address = '不知道到底在哪儿。。。';
        school.tags.push('化学');
        request(app).post('/api/schools/' + school.name).send(school).expect(201).end(function (err, res) {
            SchoolUpdated = res.body;
            console.log(res.body);
            SchoolUpdated.address.should.be.eql(school.address);
            SchoolUpdated.tags.should.containEql('化学');
            done();
        });
    });
});
