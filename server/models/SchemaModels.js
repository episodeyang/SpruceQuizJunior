/**
 * @fileOverview MongoDB Schema Configurations
 * @author Ge Yang
 * @version 0.0.1
 * @type {_|exports}
 * @private
 */

define(['underscore', 'mongoose'], function (_, mongoose) {
    "use strict";
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
        },
        postPrototype: {
            text: String,
            author: String,//{type: Schema.Types.ObjectId, ref: 'User'},
            dateOfCreation: Date,
            dateEdited: Date,
        },
        answer: {
            text: String,
            author: String,//{type: Schema.Types.ObjectId, ref: 'User'},
            dateOfCreation: Date,
            dateEdited: Date,
            upvote: Number,
            downvote: Number,
            __virtuals__: {
                voteGet: function () { return this.upvote - this.downvote; }
            },
            __options__: {
                toJSON: {
                    getters: true,
                    virtuals: true
                },
                toObject: {
                    getters: true,
                    virtuals: true
                }
            }
        }
    };
    var subSchema = {};
    _.each(config_nest, function (schema, title) {
        if (schema.__methods__) {
            var methods = schema.__methods__;
            delete schema.__methods__;
        }
        if (schema.__virtuals__) {
            var virtuals = schema.__virtuals__;
            delete schema.__virtuals__;
        }
        if (schema.__options__) {
            var options = schema.__options__;
            delete schema.__options__;
        }
        subSchema[capitalize(title)] = new mongoose.Schema(schema);
        if (methods) {
            _.each(methods, function (method, methodKey) {
                subSchema[capitalize(title)].methods[methodKey] = method;
            });
        }
        if (virtuals) {
            _.each(virtuals, function (virtual, virtualKey) {
                if (virtualKey.slice(-3) == 'Set') {
                    subSchema[capitalize(title)].virtual(virtualKey.slice(0, -3)).set(virtual);
                } else {
                    subSchema[capitalize(title)].virtual(virtualKey.slice(0, -3)).get(virtual);
                };
            });
        }
        if (options) {
            _.each(options, function (option, optionKey) {
                subSchema[capitalize(title)].set(optionKey, option);
            });
        }
    });

    /**
     * @typedef schema {{name: string, lang: string}}
     * @type {{schemaConfig: Object.<string, schema>}}
     */
    var config = {
        user: {
            username: {
                type: String,
                unique: true
            },
            password: String,
            role: {title: String, bitMask: Number},
            student: { type: Schema.Types.ObjectId, ref: "Student"},
            parent: { type: Schema.Types.ObjectId, ref: "Parent"},
            teacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
            admin: { type: Schema.Types.ObjectId, ref: "Admin" },
            superadmin: { type: Schema.Types.ObjectId, ref: "Superadmin" },
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
        student: {
            name: String,
            DOB: Date,
            email: String,
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
            name: String,
            email: String,
            studentIds: [
                { type: Schema.Types.ObjectId, ref: 'Student' }
            ]
        },
        teacher: {
            name: String,
            email: String,
            sections: [
                { type: Schema.Types.ObjectId, ref: 'Section' }
            ],
            schools: [
                { type: Schema.Types.ObjectId, ref: 'School' }
            ]
        },
        admin: {
            name: String,
            email: String,
            schools: [
                { type: Schema.Types.ObjectId, ref: 'schools' }
            ]
        },
        superadmin: {
            name: String
        },
        question: {
            title: String,
            text: String,
            authors: String,
            tags: Array,
            comments: [subSchema.PostPrototype],
            answers: [subSchema.answer],
            __virtuals__: {
                idGet: function () { return this._id; }
            },
            __options__: {
                toJSON: {
                    getters: true,
                    virtuals: true,
                    transform: function (doc, rtn, options) { delete rtn._id; delete rtn.__v; }
                },
                toObject: {
                    getters: true,
                    virtuals: true
                }
            }
        },
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
            quizProblems: [subSchema.QuizProblem]
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
        if (schema.__methods__) {
            var methods = schema.__methods__;
            delete schema.__methods__;
        }
        if (schema.__virtuals__) {
            var virtuals = schema.__virtuals__;
            delete schema.__virtuals__;
        }
        if (schema.__options__) {
            var options = schema.__options__;
            delete schema.__options__;
        }
        Config[title + 'Schema'] = new mongoose.Schema(schema, {collection: title});
        if (methods) {
            _.each(methods, function (method, methodKey) {
                Config[title + 'Schema'].methods[methodKey] = method;
            });
        }
        if (virtuals) {
//            console.log('showing the virtuals of this schema: ' + title);
//            console.log(virtuals);
            _.each(virtuals, function (virtual, virtualKey) {
                if (virtualKey.slice(-3) == 'Set') {
                    Config[title + 'Schema'].virtual(virtualKey.slice(0, -3)).set(virtual);
                } else {
//                    console.log('showing the virtual key');
//                    console.log(virtualKey.slice(0,-3));
                    Config[title + 'Schema'].virtual(virtualKey.slice(0, -3)).get(virtual);
                };
            });
        }
        if (options) {
            _.each(options, function (option, optionKey) {
                Config[title + 'Schema'].set(optionKey, option);
            });
        }
        Config[capitalize(title)] = mongoose.model(capitalize(title), Config[title + 'Schema']);
    });
    Config.__config = config;
    Config.__config_nest = config_nest;
    return Config;
})
