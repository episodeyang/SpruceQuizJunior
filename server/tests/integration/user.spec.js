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

describe('User API test - ', function (done) {
    beforeEach(function () {
        passportStub.login(studentUser); // logout after each test
    });
    afterEach(function () {
        passportStub.logout(); // logout after each test
    });
    it('update user', function (done) {
        // api requires role entry to exist in the payload.
        data.studentInfo.role = data.studentUser.role;
        request(app).post('/api/users/' + studentUser.username).send(data.studentInfo).expect(201).end(function (err, res) {
            user = res.body;
            user.signature.should.eql(data.studentInfo.signature);
            done();
        });
    });
});

