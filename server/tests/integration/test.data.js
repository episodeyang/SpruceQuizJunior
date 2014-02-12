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
// user, register, and login data
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
    /** Student login data for passportStub*/
    studentUser: {
        username: 'student',
        role: userRoles.student
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
    /** superadmin login data for passportStub*/
    superadminUser: {
        username: 'superadmin',
        role: userRoles.superadmin
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
    /** admin login data for passportStub*/
    adminUser: {
        username: 'admin',
        role: userRoles.admin
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
    /** teacher login data for passportStub*/
    teacherUser: {
        username: 'teacher',
        role: userRoles.teacher
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
    /** parent login data for passportStub*/
    parentUser: {
        username: 'parent',
        role: userRoles.parent
    },
//question data
    questionCreate: {
        title: '行程问题解法',
        text: 'some example text here',
        author: {
                name: '王小一个',
                username: 'thelittleone'
        },
        tags: ['三年级', '数学', '二元一次方程'],
        comments: [{text: '这个问题很有趣', author: 'authorName'}],
        answers: [
            {text: '这道题的解法应该是这样的：', author: 'authorName2', upvote: 0, downvote: 0 }
        ]

    },
    questionCreate2: {
        title: '行程问题解法',
        text: '<p>这是迎春杯数学竞赛的一道应用题：</p><p><br></p><pre>甲、乙两车分别从A、B两地同时出发相向而行，6小时后相遇在C点，如果甲车速度不变，乙车每小时多行5千米，且两车还从A、B两地同时出发相向而行，则相遇地点距C点12千米；如果乙车速度不变，甲车每小时多行5千米，且两车还从A、B两地同时出发相向而行，则相遇地点距C点16千米，甲车原来每小时行多少千米？<br> <ol><li><span style="line-height: 1.428571429;">20</span></li><li><span style="line-height: 1.428571429;">40</span></li><li><span style="line-height: 1.428571429;">30</span></li><li><span style="line-height: 1.428571429;">10</span></li></ol></pre><h4>我尝试的过程：</h4><p><br></p><blockquote>设乙增加速度后，两车在D处相遇，所用时间为T小时，甲增加速度后，两车在E处相遇，由于这两种情况，两车的速度和相同，所以所用时间也相同，于是甲、乙不增加速度时，经T小时分别到达D，E。DE＝12+16＝28（千米）。<br><br>由于甲或乙增加速度每小时5千米，两车在D或E相遇，所以用每小时5千米的速度，T小时走过28千米，从而T＝28÷5＝28/5（小时），甲用6-28/5＝2/5（小时），走过12千米，所以甲原来每小时行12÷2/5＝30（千米）。</blockquote><p>问题：有没有更快更简单的解法？</p>',
        author: {
            name: '王小一个',
            username: 'thelittleone'
        },
        tags: ['三年级', '数学', '二元一次方程'],
        voteup: ['王小一个'],
        votedown: ['陈理中'],
        comments: [{text: '这个问题很有趣', author: 'authorName'}],
        answers: [
            {text: '这道题的解法应该是这样的：', author: 'authorName2', upvote: 0, downvote: 0 }
        ]

    }
};

module.exports = testData;
