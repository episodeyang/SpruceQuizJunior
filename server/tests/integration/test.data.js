/**
 * @fileOverview Test data for the integrated server test.
 * @author Ge Yang
 * @type {_|exports}
 * @private
 */

'use strict'

/** @ignore */
var _ = require('underscore')
    , check = require('validator').check
    , userRoles = require('../../../client/js/rolesHelper').userRoles;
/**
 * @module Test
 */

/**
 * API test data
 * @namespace
 */
var testData = {
    /** Student registration data */
    studentRegister: {
        username: 'student',
        password: 'password',
        role: userRoles.student,
        params: {
            schoolName: '北京景山学校',
            name: '杨歌',
            DOB: new Date(1987, 4, 6, 9, 0, 0),
            email: 'yangge1987@gmail.com'
        }
    },
    /** Student login data */
    studentLogin: {
        username: 'student',
        password: 'password'
    },
    /** superadmin registration data */
    superadminRegister: {
        username: 'superadmin',
        password: 'password',
        role: userRoles.superadmin,
        params: {
            schoolName: '南山区实验中学',
            name: '欧洁瑜',
            DOB: new Date(1990, 12, 20),
            email: 'ou.jieyu@gmail.com'
        }
    },
    /** superadmin login data */
    superadminLogin: {
        username: 'superadmin',
        password: 'password'
    },
    /** admin registration data */
    adminRegister: {
        username: 'admin',
        password: 'password',
        role: userRoles.admin,
        params: {
            schoolName: '北京四中',
            name: '李新伟',
            DOB: new Date(1960, 1, 1),
            email: 'xinwei.li@gmail.com'
        }
    },
    /** admin login data*/
    adminLogin: {
        username: 'admin',
        password: 'password'
    },
    /** teacher registration data*/
    teacherRegister: {
        username: 'teacher',
        password: 'password',
        role: userRoles.teacher,
        params: {
            schoolName: '北京景山学校',
            name: '欧丽',
            DOB: new Date(1970, 1, 1),
            email: 'ouli@126.com'
        }
    },
    /** teacher login data*/
    teacherLogin: {
        username: 'teacher',
        password: 'password'
    },
    /** parent registration data*/
    parentRegister: {
        username: 'parent',
        password: 'password',
        role: userRoles.parent,
        params: {
            name: '张力',
            DOB: new Date(1960, 6, 13),
            email: 'zhangli@126.com'
        }
    },
    /** parent login data*/
    parentLogin: {
        username: 'parent',
        password: 'password'
    },


    //question data
    questionCreate: {
        title: '行程问题解法',
        text: 'some example text here',
        tags: ['三年级', '数学', '二元一次方程'],
        author: [
            {
                name: '王小一个'
            }
        ]
    }
};

module.exports = testData;
