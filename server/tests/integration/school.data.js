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
 * @module Test.Data
 */

/**
 * API test data
 * @namespace
 */
var testData = {
// user, register, and login data
    /** student info data for updated student info */
    studentInfo: {
        signature: '让知识没有疆界',
        strongSubjects: ['软件开发', '创业学'],
        extracurriculars: ['中长跑', '机器人竞赛'],
        stats: {
            questionCount: 25,
            commentCount: 30,
            answerCount: 125,
            editCount: 21,
            reputation: 14500
        },
        /** school fragment data for updated student info */
        schoolRecord: [
            {
                name: '北京四中',
                classYear: 2010,
                type: '中学',
                entrance: 2007,
                left: 2010,
                alumni: true
            },
            {
                name: '人民大学附属中学',
                classYear: 2013,
                type: '高中',
                entrance: 2010,
                left: 2013,
                alumni: true,
                majors: ['数学', '物理']
            },
            {
                name: '清华大学',
                classYear: 2018,
                type: '大学',
                entrance: 2013,
                left: null,
                alumni: false,
                majors: ['数学', '物理']
            }
        ],
        teacherFields: {
            comment: "student同学非常爱学",
            strengths: ['认真', '肯于钻研'],
            weaknesses: ['缺乏纪律性', '缺乏自控能力']
        }

    },
    schools: [
        {
            name: '清华大学',
            type: '高校',
            address: '北京清华园1号',
            state: '北京',
            country: '中国',
            url: 'www.tsinghua.edu.cn',
            foundingYear: 1911,
            degrees: ['bachelor', 'master', 'doctor'],
            tags: ['公立'],
            '部委': '教育部'
        },
        {
            name: '北京景山学校',
            type: '小中高',
            address: '北京市东城区灯市口大街53号 ',
            zip: '100006',
            state: '北京',
            country: '中国',
            url: 'www.bjjsschool.net',
            foundingYear: 1968,
            degrees: ['bachelor', 'master', 'doctor'],
            tags: ['公立'],
            '部委': '教育部'
        }
    ]

};

module.exports = testData;
