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
var sessionData = {
    session: {
        title: "我们的身体里有一条鱼",
        teachers: [
            {name: '杨,歌', username: 'yang.ge'}
        ],
        members: [
            {name: 'student', username: 'student'}
        ],
        overview: '这是一堂关于进化论的课程',
        school: '北京大学',
        created: Date.now(),
        finished: null,
        reviews: [
            {
                text: '这堂课相当不错啊。真心非常喜欢。',
                author: {name: '杨歌', username: 'yang.ge'},
                dateOfCreation: Date.now(),
                dateEdited: Date.now(),
                voteup: ['yang.ge'],
                votedown: []
            }
        ],
        tags: ['进化论', '古生物学', '生物学', '科普'],
        mother: undefined,
        children: [],
        knowledgeTree: {},
        tableOfContent: {}
    }
};

module.exports = sessionData;
