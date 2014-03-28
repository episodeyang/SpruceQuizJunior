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
    function subSchemaBuilder (schema, title) {
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
        // create subdocument without the `_id` key
        subSchema[capitalize(title)] = new mongoose.Schema(schema);//, {_id: false});
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
        user: {
            username: String,
            name: String
        }
    };
    _.each(config_nest, subSchemaBuilder);

    var config_nest_2 = {
        commentPrototype: {
            text: String,
            author: config_nest.user, //{type: Schema.Types.ObjectId, ref: 'User'},
            dateOfCreation: Date,
            dateEdited: Date,
            voteup: [String],
            votedown: [String],
            __virtuals__: {
                idGet: function () { return this._id; },
                voteGet: function () { return _.size(this.voteup) - _.size(this.votedown) || '' }
            },
            __options__: {
                toJSON: {
                    getters: true,
                    virtuals: true,
                    transform: function (doc, rtn, options) { delete rtn._id; }
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
            author: config_nest.user, //{type: Schema.Types.ObjectId, ref: 'User'},
            dateOfCreation: Date,
            dateEdited: Date,
            voteup: [String],
            votedown: [String],
            __virtuals__: {
                idGet: function () { return this._id; },
                voteGet: function () { return _.size(this.voteup) - _.size(this.votedown) || '' }
            },
            __options__: {
                toJSON: {
                    getters: true,
                    virtuals: true,
                    transform: function (doc, rtn, options) { delete rtn._id; }
                },
                toObject: {
                    getters: true,
                    virtuals: true
                }
            }
        },
        answer: {
            text: String,
            author: config_nest.user, //{type: Schema.Types.ObjectId, ref: 'User'},
            dateCreated: {type: Date, default: Date.now},
            dateEdited: {type: Date},
            voteup: { type: [String], 'default': []},
            votedown: { type: [String], 'default': []},
//            comments: {type: [subSchema.CommentPrototype], 'default': []},
            __virtuals__: {
                idGet: function () { return this._id; },
                voteGet: function () { return _.size(this.voteup) - _.size(this.votedown) || "0" }
            },
            __options__: {
                toJSON: {
                    getters: true,
                    virtuals: true,
                    transform: function (doc, rtn, options) { delete rtn._id; }
                },
                toObject: {
                    getters: true,
                    virtuals: true
                }
            }
        },
        feed: {
            action: String,
            data: Schema.Types.Mixed
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
        userFeed: {
            user: {type: Schema.Types.ObjectId},
            page: {type: Number, index: true},
            count: {type: Number, index: true},
            feeds: [subSchema.Feed]
        },
        sessionFeed: {
            session: {type: Schema.Types.ObjectId},
            page: {type: Number, index: true},
            count: {type: Number, index: true},
            feeds: [subSchema.Feed]
        },
        textbookFeed: {
            session: {type: Schema.Types.ObjectId},
            page: {type: Number, index: true},
            count: {type: Number, index: true},
            feeds: [subSchema.Feed]
        },
        question: {
            title: String,
            text: String,
            author: config_nest.user, //Here I am just sharing the definition, but not the schema. Subschema without array is currently not supported in mongoose.
            tags: Array,
            comments: {type: [subSchema.CommentPrototype], 'default': []},
            answerComments: {type: [subSchema.AnswerCommentPrototype], 'default': []},
            answers: [subSchema.Answer],
            voteup: { type: [String], 'default': []},
            votedown: { type: [String], 'default': []},
            dateCreated: { type: Date, default: Date.now },
            dateEdited: { type: Date },
            __virtuals__: {
                idGet: function () { return this._id; },
                voteGet: function () { return _.size(this.voteup) - _.size(this.votedown) || 0 },
                nAnswersGet: function () { return _.size(this.answers); }
            },
            __options__: {
                toJSON: {
                    getters: true,
                    virtuals: true,
                    transform: function (doc, rtn, options) {
                        delete rtn._id;
                        delete rtn.__v;
                    }
                },
                toObject: {
                    getters: true,
                    virtuals: true
                }
            }
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
