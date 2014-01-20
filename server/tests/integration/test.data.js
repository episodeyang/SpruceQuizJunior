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
            name: '杨歌',
            DOB: new Date(1987, 4, 6, 9, 0, 0),
            email: 'yangge1987@gmail.com'
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
        params: {
            schoolName: '南山区实验中学',
            name: '欧洁瑜',
            DOB: new Date(1990, 12, 20),
            email: 'ou.jieyu@gmail.com'
        }
    },
    superadminLogin: {
        username: 'superadmin',
        password: 'password'
    },

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
    adminLogin: {
        username: 'admin',
        password: 'password'
    },
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
    teacherLogin: {
        username: 'teacher',
        password: 'password'
    },
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
    parentLogin: {
        username: 'parent',
        password: 'password'
    }
};

module.exports = data;
