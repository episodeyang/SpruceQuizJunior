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
var bookData = {
    book: {
        title: "我们的身体里有一条鱼",
        authors: [
            {name: 'Shubin,Neil', username: null}
        ],
        category: String,
        coverUrl: 'http://img5.douban.com/mpic/s4029808.jpg',
        editions: [],
        related: [],
        metaData: {
            publisher: 'Pantheon',
            yearOfPublication: Date.now(),
            wordCount: null,
            pages: 320
        },
        reviews: [{
            text: '这本书相当不错啊。真心非常喜欢。',
            author: {name: '杨歌', username: 'yang.ge'},
            dateOfCreation: Date.now(),
            dateEdited: Date.now(),
            voteup: ['yang.ge'],
            votedown: []
        }],
        tags: ['进化论','古生物学','生物学','科普'],
        parents: [],
        children: [],
        knowledgeTree: {},
        tableOfContent: {}
    }
};

module.exports = bookData;
