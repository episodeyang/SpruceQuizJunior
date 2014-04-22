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
                type: 'middleSchool',
                entrance: 2007,
                left: 2010,
                alumni: true
            },
            {
                name: '人民大学附属中学',
                classYear: 2013,
                type: 'highSchool',
                entrance: 2010,
                left: 2013,
                alumni: true,
                majors: ['数学', '物理']
            },
            {
                name: '清华大学',
                classYear: 2018,
                type: 'highSchool',
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

    }
};

module.exports = testData;
