'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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

var QuizProblemSchema = new mongoose.Schema(config_nest.quizProblem);
var ExamProblemSchema = new mongoose.Schema(config_nest.examProblem);

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
        quizProblems: [QuizProblemSchema]
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
        examProblems: [ExamProblemSchema]
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
        userId: { type: Schema.Types.ObjectId }   //Note: not reference
    },
    feed: {
        userId: { type: Schema.Types.ObjectId },   //Note: not reference
        groupId: { type: Schema.Types.ObjectId },   //Note: not reference
        type: String,
        feedData: String,
        createdDate: Date,
        archived: Array
    }
};

//Problem schema
var ProblemSchema = new mongoose.Schema(config.problem, { collection: 'problem' });
var Problem = mongoose.model('Problem', ProblemSchema);

//MistakeTag schema
var MistakeTagSchema = new mongoose.Schema(config.mistakeTag, { collection: 'mistakeTag' });
var MistakeTag = mongoose.model('MistakeTag', MistakeTagSchema);

//ProblemNote schema
var ProblemNoteSchema = new mongoose.Schema(config.problemNote, { collection: 'problemNote' });
var ProblemNote = mongoose.model('ProblemNote', ProblemNoteSchema);

//Quiz schema
var QuizSchema = new mongoose.Schema(config.quiz, { collection: 'quiz' });
var Quiz = mongoose.model('Quiz', QuizSchema);

//Material schema
var MaterialSchema = new mongoose.Schema(config.material, { collection: 'material' });
var Material = mongoose.model('Material', MaterialSchema);

//Unit schema
var UnitSchema = new mongoose.Schema(config.unit, { collection: 'unit' });
var Unit = mongoose.model('Unit', UnitSchema);

//School schema
var SchoolSchema = new mongoose.Schema(config.school, { collection: 'school' });
var School = mongoose.model('School', SchoolSchema);

//Section schema
var SectionSchema = new mongoose.Schema(config.section, { collection: 'section' });
var Section = mongoose.model('Section', SectionSchema);

//Exam and sub-problem-object schema
var ExamSchema = new mongoose.Schema(config.exam, { collection: 'exam' });
var Exam = mongoose.model('Exam', ExamSchema);

//Erratum schema
var ErratumSchema = new mongoose.Schema(config.erratum, { collection: 'erratum' });
var Erratum = mongoose.model('Erratum', ErratumSchema);

//Student schema
var StudentSchema = new mongoose.Schema(config.student, { collection: 'student' });
var Student = mongoose.model('Student', StudentSchema);

//Parent schema
var ParentSchema = new mongoose.Schema(config.parent, { collection: 'parent' });
var Parent = mongoose.model('Parent', ParentSchema);

//Teacher schema
var TeacherSchema = new mongoose.Schema(config.teacher, { collection: 'teacher' });
var Teacher = mongoose.model('Teacher', TeacherSchema);

//Admin schema
var AdminSchema = new mongoose.Schema(config.admin, { collection: 'admin' });
var Admin = mongoose.model('Admin', AdminSchema);

//Superadmin schema
var SuperadminSchema = new mongoose.Schema(config.superadmin, { collection: 'superadmin' });
var Superadmin = mongoose.model('Superadmin', SuperadminSchema);

//User schema
var UserSchema = new mongoose.Schema(config.user, { collection: 'user' });
UserSchema.methods.validPassword = function (password) {
    if (password === this.password) {
        return true;
    } else {
        return false;
    }
};
var User = mongoose.model('User', UserSchema);

//Newsfeed schema
var FeedSchema = new mongoose.Schema(config.feed, { collection: 'feed' });
var Feed = mongoose.model('Feed', FeedSchema);

//other schemas here

//exports
module.exports = {
    _config: config,
    _config_nest: config_nest,
    Material: Material,
    Unit: Unit,
    Section: Section,
    School: School,
    Student: Student,
    Parent: Parent,
    Teacher: Teacher,
    Admin: Admin,
    Superadmin: Superadmin,
    User: User,
    MistakeTag: MistakeTag,
    Problem: Problem,
    ProblemNote: ProblemNote,
    Exam: Exam,
    Erratum: Erratum,
    Quiz: Quiz,
    Feed: Feed
}
