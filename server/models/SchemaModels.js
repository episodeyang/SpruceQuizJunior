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

    var subSchema = {};

    function subSchemaBuilder(schema, title) {
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
        if (options && options._id === false) {
            subSchema[capitalize(title)] = new mongoose.Schema(schema, {_id: false});
            delete options._id;
        } else {
            subSchema[capitalize(title)] = new mongoose.Schema(schema);//, {_id: false});
        }
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
                }
                ;
            });
        }
        if (options) {
            _.each(options, function (option, optionKey) {
                subSchema[capitalize(title)].set(optionKey, option);
            });
        }
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
        userFragment: {
            username: String,
            name: String,
            __options__: {
                _id: false
            }
        }
    };
    _.each(config_nest, subSchemaBuilder);

    var config_nest_2 = {
        editStub: {
            dateEdited: Date,
            user: config_nest.userFragment
        },
        commentPrototype: {
            text: String,
            author: config_nest.userFragment, //{type: Schema.Types.ObjectId, ref: 'User'},
            dateOfCreation: {type: Date, default: Date.now},
            dateEdited: Date,
            voteup: [String],
            votedown: [String],
            __virtuals__: {
                idGet: function () {
                    return this._id;
                },
                voteGet: function () {
                    return _.size(this.voteup) - _.size(this.votedown) || '';
                }
            },
            __options__: {
                toJSON: {
                    getters: true,
                    virtuals: true
//                    transform: function (doc, rtn, options) {
//                        delete rtn._id;
//                    }
                },
                toObject: {
                    getters: true,
                    virtuals: true
                }
            }
        },
        answerCommentPrototype: {
            answerId: Schema.Types.ObjectId,
            text: String,
            author: config_nest.userFragment, //{type: Schema.Types.ObjectId, ref: 'User'},
            dateOfCreation: Date,
            dateEdited: Date,
            voteup: [String],
            votedown: [String],
            __virtuals__: {
                idGet: function () {
                    return this._id;
                },
                voteGet: function () {
                    return _.size(this.voteup) - _.size(this.votedown) || '';
                }
            },
            __options__: {
                toJSON: {
                    getters: true,
                    virtuals: true
//                    transform: function (doc, rtn, options) {
//                        delete rtn._id;
//                    }
                },
                toObject: {
                    getters: true,
                    virtuals: true
                }
            }
        },
        answer: {
            text: String,
            author: config_nest.userFragment, //{type: Schema.Types.ObjectId, ref: 'User'},
            dateCreated: {type: Date, default: Date.now},
            edits: [subSchema.EditStub],
            voteup: { type: [String], 'default': []},
            votedown: { type: [String], 'default': []},
//            comments: {type: [subSchema.CommentPrototype], 'default': []},
            __virtuals__: {
                idGet: function () {
                    return this._id;
                },
                voteGet: function () {
                    return _.size(this.voteup) - _.size(this.votedown) || "0";
                }
            },
            __options__: {
                toJSON: {
                    getters: true,
                    virtuals: true,
                    transform: function (doc, rtn, options) {
                        delete rtn._id;
                    }
                },
                toObject: {
                    getters: true,
                    virtuals: true
                }
            }
        },
        feed: {
            actionType: String,
            time: {type: Date, default: Date.now},
            reason: String,
            user: Schema.Types.Mixed,
            question: Schema.Types.Mixed,
            answer: Schema.Types.Mixed,
            comment: Schema.Types.Mixed,
            answerComment: Schema.Types.Mixed,
            session: Schema.Types.Mixed,
            book: Schema.Types.Mixed
        },
        school: {
            name: String,
            classYear: Number,
            type: String,
            entrance: Number,
            left: Number,
            alumni: Boolean,
            majors: [String]
        },
        book: {
            _id: {type: Schema.Types.ObjectId, default: null},
            title: String,
            authors: [subSchema.UserFragment],
            coverUrl: String
        }
    };

    _.each(config_nest_2, subSchemaBuilder);
    _.extend(config_nest, config_nest_2);

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
            name: String,
            password: String,
            role: {title: String, bitMask: Number},
            reputation: {type: Number, default: 1},
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
        userFeed: {
            username: {type: String, index: true},
            page: {type: Number, index: true, default: 0},
            count: {type: Number},
            feeds: [subSchema.Feed],
            __index__: {
                username: 1,
                page: -1
            }
        },
        student: {
            name: String,
            signature: String,
            username: {type: String, unique: true},
            DOB: Date,
            gender: String,
            domainName: String,
            created: {type: Date, default: Date.now},
            email: String,
            addresses: [String],
            strongSubjects: [String],
            extracurriculars: [String],
            schoolRecord: [ subSchema.school ],
            teacherFields: { type: Schema.Types.Mixed, default: {}},
            stats: { type: Schema.Types.Mixed, default: {}},
            sessions: [
                { type: Schema.Types.ObjectId, ref: 'Session' }
            ],
            schools: [
                { type: String, ref: 'School' }
            ],
            books: [
                { type: Schema.Types.ObjectId, ref: 'Book'}
            ],
            preferences: {
            },
            info: Schema.Types.Mixed
        },
        parent: {
            name: String,
            signature: String,
            username: {type: String, unique: true},
            DOB: Date,
            gender: String,
            domainName: String,
            created: {type: Date, default: Date.now},
            email: String,
            addresses: [String],
            strongSubjects: [String],
            extracurriculars: [String],
            schoolRecord: [ subSchema.school ],
            teacherFields: { type: Schema.Types.Mixed, default: {}},
            stats: { type: Schema.Types.Mixed, default: {}},
            sessions: [
                { type: Schema.Types.ObjectId, ref: 'Session' }
            ],
            schools: [
                { type: String, ref: 'School' }
            ],
            books: [
                { type: Schema.Types.ObjectId, ref: 'Book'}
            ],
            children: [
                { type: Schema.Types.ObjectId, ref: 'Student' }
            ],
            preferences: {
            },
            info: Schema.Types.Mixed
        },
        teacher: {
            name: String,
            signature: String,
            username: {type: String, unique: true},
            DOB: Date,
            gender: String,
            domainName: String,
            created: {type: Date, default: Date.now},
            email: String,
            addresses: [String],
            strongSubjects: [String],
            extracurriculars: [String],
            schoolRecord: [ subSchema.school ],
            teacherFields: { type: Schema.Types.Mixed, default: {}},
            stats: { type: Schema.Types.Mixed, default: {}},
            sessions: [
                { type: Schema.Types.ObjectId, ref: 'Session' }
            ],
            schools: [
                { type: String, ref: 'School' }
            ],
            books: [
                { type: Schema.Types.ObjectId, ref: 'Book'}
            ],
            preferences: {
            },
            info: Schema.Types.Mixed
        },
        admin: {
            name: String,
            signature: String,
            username: {type: String, unique: true},
            DOB: Date,
            gender: String,
            domainName: String,
            created: {type: Date, default: Date.now},
            email: String,
            addresses: [String],
            strongSubjects: [String],
            extracurriculars: [String],
            schoolRecord: [ subSchema.school ],
            teacherFields: { type: Schema.Types.Mixed, default: {}},
            stats: { type: Schema.Types.Mixed, default: {}},
            sessions: [
                { type: Schema.Types.ObjectId, ref: 'Session' }
            ],
            schools: [
                { type: String, ref: 'School' }
            ],
            books: [
                { type: Schema.Types.ObjectId, ref: 'Book'}
            ],
            preferences: {
            },
            info: Schema.Types.Mixed
        },
        superadmin: {
            name: String,
            signature: String,
            username: {type: String, unique: true},
            gender: String,
            domainName: String,
            DOB: Date,
            created: {type: Date, default: Date.now},
            email: String,
            addresses: [String],
            strongSubjects: [String],
            extracurriculars: [String],
            schoolRecord: [ subSchema.school ],
            teacherFields: { type: Schema.Types.Mixed, default: {}},
            stats: { type: Schema.Types.Mixed, default: {}},
            sessions: [
                { type: Schema.Types.ObjectId, ref: 'Session' }
            ],
            schools: [
                { type: String, ref: 'School' }
            ],
            books: [
                { type: Schema.Types.ObjectId, ref: 'Book'}
            ],
            preferences: {
            },
            info: Schema.Types.Mixed
        },
        book: {
            title: String,
            authors: [subSchema.UserFragment],
            overview: String,
            category: String,
            coverUrl: String,
            editions: [String],
            related: [String],
            questions: [
                {type: Schema.Types.ObjectId, ref: 'Question'}
            ],
            metaData: {
                publisher: String,
                yearOfPublication: Number,
                wordCount: Number,
                pages: Number
            },
            reviews: [subSchema.CommentPrototype],
            tags: [String],
            parents: [String],
            children: [String],
            knowledgeTree: { type: Schema.Types.Mixed },
            tableOfContent: { type: Schema.Types.Mixed },
            admins: [subSchema.UserFragment],
            members: [subSchema.UserFragment],
            adminsArchive: [subSchema.UserFragment],
            membersArchive: [subSchema.UserFragment]
        },
        bookFeed: {
            bookId: {
                type: Schema.Types.ObjectId
            },
            page: { type: Number, index: true },
            count: { type: Number, index: false },
            feeds: [subSchema.Feed],
            __index__: {
                bookId: 1,
                page: -1
            }
        },
        school: {
            _id: {type: String, unique: true}, //In fact this is the name of the school
            type: String,
            address: String,
            zipCode: String,
            state: String,
            country: String,
            overview: String,
            url: String,
            foundingYear: Number,
            degrees: [String],
            tags: [String],
            '部委': String,
            stats: {type: Schema.Types.Mixed},
            teachers: [subSchema.UserFragment],
            sessions: [
                {type: Schema.Types.ObjectId, ref: 'Session'}
            ],
            created: {type: Date, default: Date.now},
            edited: Date,
            __virtuals__: {
                nameGet: function () {
                    return this._id;
                },
                nameSet: function () {
                    this._id = this.name;
                }
            },
            __options__: {
                toJSON: {
                    getters: true,
                    virtuals: true
                    // transform: function (doc, rtn, options) {
                    //     delete rtn._id;
                    // }
                },
                toObject: {
                    getters: true,
                    virtuals: true
                }
            }
        },
        session: {
            name: String,
            subject: String,
            courseString: String,
            closed: Boolean,
            tags: [String],
            teachers: [subSchema.UserFragment],
            members: [subSchema.UserFragment],
            teachersArchive: [subSchema.UserFragment],
            membersArchive: [subSchema.UserFragment],
            school: String,
            overview: String,
            created: {type: Date, default: Date.now},
            finished: {type: Date, default: null},
            knowledgeTree: { type: Schema.Types.Mixed },
            syllabus: {type: Schema.Types.Mixed },
            reviews: [subSchema.CommentPrototype],
            books: [ subSchema.Book ],
            questions: [
                { type: Schema.Types.ObjectId, ref: 'Question'}
            ],
            mother: [
                { type: Schema.Types.ObjectId, ref: 'Session'}
            ],
            children: [
                { type: Schema.Types.ObjectId, ref: 'Session'}
            ]
        },
        sessionFeed: {
            sessionId: {
                type: Schema.Types.ObjectId
            },
            page: { type: Number, index: true },
            count: { type: Number, index: false },
            feeds: [subSchema.Feed],
            __index__: {
                sessionId: 1,
                page: -1
            }
        },
        question: {
            title: String,
            text: String,
            author: config_nest.userFragment, //Here I am just sharing the definition, but not the schema. Subschema without array is currently not supported in mongoose.
            tags: Array,
            sessions: [
                { type: Schema.Types.ObjectId, default: [], ref: 'Session'}
            ],
            books: {
                type: [subSchema.Book], default: []
            },
            comments: {
                type: [subSchema.CommentPrototype], default: []
            },
            answerComments: {
                type: [subSchema.AnswerCommentPrototype], default: []
            },
            answers: { type: [subSchema.Answer], default: [] },
            voteup: {
                type: [String], 'default': []
            },
            votedown: {
                type: [String], 'default': []
            },
            dateCreated: {
                type: Date,
                default: Date.now
            },
            edits: [subSchema.EditStub],
            __virtuals__: {
                voteGet: function () {
                    return _.size(this.voteup) - _.size(this.votedown) || 0;
                },
                nAnswersGet: function () {
                    return _.size(this.answers);
                }
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
        },
        questionFeed: {
            questionId: { type: Schema.Types.ObjectId, index: true },
            answerId: { type: Schema.Types.ObjectId, index: true }, //can not be unique, because may be null.
            page: { type: Number, index: true},
            count: { type: Number, index: false },
            feeds: [subSchema.Feed],
            __index__: {
                questionId: 1,
                answerId: 1,
                page: -1
            },
            __options__: {
                _id: false,
                autoIndexId: false
            }
        },
        tag: {
            name: String,
            kins: [String],
            parent: [String],
            child: [String],
            dateCreated: { type: Date, default: Date.now},
            overview: String
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
        if (schema.__index__) {
            var indexConfig = schema.__index__;
            delete schema.__index__;
        }

        if (options) {
            var setting = { collection: title };
            if (options._id === false) {
                setting._id = false;
            }
            if (options.autoIndexId === false) {
                setting.autoIndexId = false;
            }
            Config[title + 'Schema'] = new mongoose.Schema(schema, setting);
        } else {
            Config[title + 'Schema'] = new mongoose.Schema(schema, {collection: title});
        }
        if (methods) {
            _.each(methods, function (method, methodKey) {
                Config[title + 'Schema'].methods[methodKey] = method;
            });
        }
        if (virtuals) {
            _.each(virtuals, function (virtual, virtualKey) {
                if (virtualKey.slice(-3) == 'Set') {
                    Config[title + 'Schema'].virtual(virtualKey.slice(0, -3)).set(virtual);
                } else if (virtualKey.slice(-3) == 'Get') {
                    Config[title + 'Schema'].virtual(virtualKey.slice(0, -3)).get(virtual);
                } else if (virtualKey.slice(-3) == 'Pre') {
                    Config[title + 'Schema'].pre('save', virtual);
                }
                ;
            });
        }
        if (options) {
            _.each(options, function (option, optionKey) {
                Config[title + 'Schema'].set(optionKey, option);
            });
        }
        if (indexConfig) {
            Config[title + 'Schema'].index(indexConfig);
        }
        Config[capitalize(title)] = mongoose.model(capitalize(title), Config[title + 'Schema']);
    });
    Config.subSchema = subSchema;
    Config.__config = config;
    Config.__config_nest = config_nest;
    return Config;
});
