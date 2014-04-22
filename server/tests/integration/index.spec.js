/**
 * @fileOverview Integrated Server test
 * @module Test
 * @type {exports}
 */
require('amdefine/intercept');

var app = require('../../app.js'),
    data = require('./test.data.js'),
    express = require('express'),
    request = require('supertest'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    should = require('should'),
    passportStub = require('../../lib/passport-stub.js'),//the modified version of passport-stub, for the newer interface.
    userRoles = require('../../../client/js/rolesHelper.js').userRoles,
    accessLevels = require('../../../client/js/rolesHelper.js').accessLevels,
    //getHash = require('../../../client/js/passwordHash.js').getHash,
    passwordHash = require('../../../client/js/passwordHash.js').passwordHash;



app.use(express.bodyParser());
passportStub.install(app);

var studentUser, parentUser, teacherUser, adminUser, superadminUser;

passwordHash(data.studentRegister);
passwordHash(data.teacherRegister);
passwordHash(data.parentRegister);
passwordHash(data.adminRegister);
passwordHash(data.superadminRegister);
passwordHash(data.studentLogin);
passwordHash(data.teacherLogin);
passwordHash(data.parentLogin);
passwordHash(data.adminLogin);
passwordHash(data.superadminLogin);

describe('Server Authentication Tests - ', function (done) {
    beforeEach(function () {
        passportStub.logout(); // logout after each test
    });
    afterEach(function () {
        passportStub.logout(); // logout after each test
    });

    it('/ - Return a 200. The root uri always return 200 and "index.html"', function (done) {
        request(app).get('/').expect(200, done);
    });
    it('/frontPage - Return a 200 The root uri always return 200 and "index.html"', function (done) {
        request(app).get('/frontPage').expect(200, done);
    });
    it('/user - Return a 200 The root uri always return 200 and "index.html"', function (done) {
        request(app).get('/user').expect(200, done);
    });
    it('/register - 200 ', function (done) {
        request(app).post('/register').send(data.studentRegister).expect(201, done);
    });
    it('/register - 200 parent', function (done) {
        request(app).post('/register').send(data.parentRegister).expect(201, done);
    });
    it('/register - 200 teacher', function (done) {
        request(app).post('/register').send(data.teacherRegister).expect(201, done);
    });
    it('/register - 200 admin', function (done) {
        request(app).post('/register').send(data.adminRegister).expect(201, done);
    });
    it('/register - 200 superadmin', function (done) {
        request(app).post('/register').send(data.superadminRegister).expect(201, done);
    });
    it('/login - student', function (done) {
        request(app)
            .post('/login')
            .send(data.studentLogin)
            .end(function (err, res) {
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.student.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(data.studentLogin.username);
                studentUser = res.body;
//                console.log('show student user object');
//                console.log(studentUser);
                done();
            })
    });
    it('/login - parent', function (done) {
        request(app)
            .post('/login')
            .send(data.parentLogin)
            .end(function (err, res) {
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.parent.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(data.parentLogin.username);
                parentUser = res.body;
                done();
            })
    });
    it('/login - teacher', function (done) {
        request(app)
            .post('/login')
            .send(data.teacherLogin)
            .end(function (err, res) {
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.teacher.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(data.teacherLogin.username);
                teacherUser = res.body;
                done();
            })
    });
    it('/login - admin', function (done) {
        request(app)
            .post('/login')
            .send(data.adminLogin)
            .end(function (err, res) {
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.admin.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(data.adminLogin.username);
                adminUser = res.body;
                done();
            })
    });
    it('/login - superadmin', function (done) {
        request(app)
            .post('/login')
            .send(data.superadminLogin)
            .end(function (err, res) {
                if (err) return done(err);
                "use strict";
                res.body.role.bitMask.should.equal(require('../../../client/js/rolesHelper.js').userRoles.superadmin.bitMask);
                res.body.should.have.property("id");
                res.body.username.should.equal(data.superadminLogin.username);
                superadminUser = res.body;
                done();
            })
    });

});

