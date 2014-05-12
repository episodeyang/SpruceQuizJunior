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
    sessions: [
        {
            name: "我们的身体里有一条鱼",
            subject: '生物',
            teachers: [
                {name: '杨,歌', username: 'yang.ge'}
            ],
            members: [
                {name: 'student', username: 'student'}
            ],
            overview: '这是一堂关于进化论的课程',
            school: '清华大学',
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
        },
        {
            name: "动物学",
            subject: '生物',
            teachers: [
                {name: '杨,歌', username: 'yang.ge'}
            ],
            members: [
                {name: 'student', username: 'student'}
            ],
            overview: '动物学作为生物学的一大分支，研究范围涉及动物的形态、生理构造、生活习性、发展及进化史、遗传及行为特征、分布、以及与环境间相互关系。您也可以通过以下链接找到动物的分类。专门研究动物学的学者，称为动物学家。',
            school: '清华大学',
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
            tags: ['动物学', '分类学', '生物学', '科普'],
            mother: undefined,
            children: [],
            knowledgeTree: {},
            tableOfContent: {}
        },
        {
            name: "生物化学",
            subject: '生物',
            teachers: [
                {name: '昌增益', username: undefined}
            ],
            members: [
                {name: 'student', username: 'student'}
            ],
            overview: '从生物大分子入手，讲解各种反应代谢过程的生物化学机理。',
            school: '清华大学',
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
            tags: ['生物化学', '古生物学', '生物学', '科普'],
            mother: undefined,
            children: [],
            knowledgeTree: {},
            tableOfContent: {}
        }
    ]
};

module.exports = sessionData;
