/**
 * Created by ge on 1/12/14.
 */
'use strict'

var _ = require('underscore')
    , check = require('validator').check
    , userRoles = require('../../../client/js/rolesHelper').userRoles;

var data = {
    studentRegister: {
        username: 'student',
        password: 'password',
        role: userRoles.student,
        params: {
            schoolName: '北京景山学校',
            firstName: '歌',
            lastName: '杨',
            birthDay: new Date(1987, 4, 6, 9, 0, 0)
        }
    },
    studentLogin: {
        username: 'student',
        password: 'password'
    },
    superadminRegister: {
        username: 'superadmin',
        password: 'password',
        role: userRoles.superadmin,
        params :{}
    },
    superadminLogin: {
        username: 'superadmin',
        password: 'password'
    },
};

module.exports = data;
