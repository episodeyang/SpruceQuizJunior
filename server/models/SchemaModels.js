'use strict';

var _ = require('underscore');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}
var config_nest = {
    quizProblem: {
        problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
        weight: Number
    },
    examProblem: {
        problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
        problemType: String,
        weight: Number,
        receivedScore: Number,
        studentAnswer: Array
    }
};

var subSchema = {};
_.each(config_nest, function (schema, title) {
    subSchema[capitalize(title)] = new mongoose.Schema(schema);
});

var config = {
    problem: {
        topLevel: Boolean,
        problemType: String,
        question: Array,
        choices: Array,
        multimedia: Array,
        subproblems: Array,
        solutions: Array,
        explanations: Array,
        hints: Array,
        hintRules: Array,
        lastUpdated: Date
    },
    mistakeTag: {
        title: String,
        comment: String
    },
    problemNote: {
        problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
        tagName: String,
        mainText: String,
        mistakeTags: [
            { type: Schema.Types.ObjectId, ref: 'MistakeTag' }
        ],
        note: String,
        lastUpdated: Date
    },
    quiz: {
        quizUUID: {
            type: String,
            unique: true
        },
        quizTitle: String,
        quizDate: Date,
        quizTopics: Array,
        totalScore: Number,
        quizProblems: [subSchema.quizProblem]
    },
    material: {
        materialName: String,
        comment: String,
        dateOfCreation: { type: Date, default: Date.now },
        dateOfModification: Date,
        lastEditedBy: String,
        sourceUrl: String,
        materialType: String
    },
    unit: {
        unitTitle: String,
        comment: String,
        father: [
            { type: Schema.Types.ObjectId, ref: 'UnitSchema' }
        ],
        child: [
            { type: Schema.Types.ObjectId, ref: 'UnitSchema' }
        ],
        items: [
            { type: Schema.Types.ObjectId, ref: 'Material' }
        ],
        archived: Array
    },
    school: {
        schoolName: String
    },
    section: {
        sectionName: String,
        sectionDisplayName: String,
        school: { type: Schema.Types.ObjectId, ref: 'School' },
        sectionParent: { type: Schema.Types.ObjectId, ref: 'SectionSchema' },
        sectionUnits: [
            { type: Schema.Types.ObjectId, ref: 'Unit' }
        ]
    },
    exam: {
        examTitle: String,
        examDate: Date,
        section: { type: Schema.Types.ObjectId, ref: 'Section' },
        attendence: Boolean,
        totalScore: Number,
        totalReceivedScore: Number,
        rank: Number,
        examProblems: [subSchema.ExamProblem]
    },
    erratum: {
        title: String,
        subject: String,
        url: String,
        problemNotes: [
            { type: Schema.Types.ObjectId, ref: 'ProblemNotes' }
        ],
        dateCreated: Date,
        dateModified: Date
    },
    student: {
        firstName: String,
        lastName: String,
        dateOfBirth: Date,
        gender: String,
        email: String,
        phone: Array,
        address: String,
        profilePic: String,
        sections: [
            { type: Schema.Types.ObjectId, ref: 'Section' }
        ],
        schools: [
            { type: Schema.Types.ObjectId, ref: 'School' }
        ],
        exams: [
            { type: Schema.Types.ObjectId, ref: 'Exam' }
        ],
        mistakeTags: [
            { type: Schema.Types.ObjectId, ref: 'MistakeTag' }
        ],
        errata: [
            { type: Schema.Types.ObjectId, ref: 'Erratum' }
        ],
        comments: String,
        preferences: {
            problemNoteListLimit: Number,
            anotherPreference: String
        }
    },
    parent: {
        parentName: String,
        studentIds: [
            { type: Schema.Types.ObjectId, ref: 'Student' }
        ]
    },
    teacher: {
        teacherName: String,
        sections: [
            { type: Schema.Types.ObjectId, ref: 'Section' }
        ],
        schools: [
            { type: Schema.Types.ObjectId, ref: 'School' }
        ]
    },
    admin: {
        adminName: String,
        schools: [
            { type: Schema.Types.ObjectId, ref: 'schools' }
        ]
    },
    superadmin: {
        superadminName: String
    },
    user: {
        username: {
            type: String,
            unique: true
        },
        password: String,
        role: {title: String, bitMask: Number},
        userId: { type: Schema.Types.ObjectId },   //Note: not reference
        __methods__: {
            validPassword: function (password) {
                if (password === this.password) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    feed: {
        userId: {
            type: Schema.Types.ObjectId
        },   //Note: not reference
        groupId: {
            type: Schema.Types.ObjectId
        },   //Note: not reference
        type: String,
        feedData: String,
        createdDate: Date,
        archived: Array
    }
};

var Config = {};
_.each(config, function (schema, title) {
    if (!schema.__methods__) {
        Config[capitalize(title)] = mongoose.model(
            capitalize(title),
            new mongoose.Schema(schema, {collection: title})
        );
    } else {
        var tempSchema = schema,
            methods = schema.__methods__;
        delete tempSchema.__methods__;
        Config[title + 'Schema'] = new mongoose.Schema(tempSchema, {collection: title}
        );
        _.each(methods, function (method, methodKey) {
            Config[title + 'Schema'].methods[methodKey] = method;
        });
        Config[capitalize(title)] = mongoose.model(capitalize(title), Config[title + 'Schema']);
    };
});
Config.__config = config;
Config.__config_nest = config_nest;

module.exports = Config;

