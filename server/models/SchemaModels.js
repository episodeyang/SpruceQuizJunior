'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Problem schema
var ProblemSchema = new mongoose.Schema({
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
}, { collection: 'problem' });

var Problem = mongoose.model('Problem', ProblemSchema);

//Quiz and sub-problem-object schema
var QuizProblemSchema = new mongoose.Schema({
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
    weight: Number
});

var QuizSchema = new mongoose.Schema({
    quizUUID: {
        type: String,
        unique: true
    },
    quizTitle: String,
    quizDate: Date,
    quizTopics: Array,
    totalScore: Number,
    quizProblems: [QuizProblemSchema]
}, { collection: 'quiz' });

var Quiz = mongoose.model('Quiz', QuizSchema);

//Material schema
var MaterialSchema = new mongoose.Schema({
    materialName: String,
    comment: String,
    dateOfCreation: { type: Date, default: Date.now },
    dateOfModification: Date,
    lastEditedBy: String,
    sourceUrl: String,
    materialType: String
}, { collection: 'material' });

var Material = mongoose.model('Material', MaterialSchema);

//Unit schema
var UnitSchema = new mongoose.Schema({
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
}, { collection: 'unit' });

var Unit = mongoose.model('Unit', UnitSchema);

//Section schema
var SectionSchema = new mongoose.Schema({
    sectionName: String,
    sectionDisplayName: String,
    sectionParent: { type: Schema.Types.ObjectId, ref: 'SectionSchema' },
    sectionUnits: [
        { type: Schema.Types.ObjectId, ref: 'Unit' }
    ],
}, { collection: 'section' });

var Section = mongoose.model('Section', SectionSchema);

//School schema
var SchoolSchema = new mongoose.Schema({
    schoolName: String,
    sections: [
        { type: Schema.Types.ObjectId, ref: 'Section' }
    ],
}, { collection: 'school' });

var School = mongoose.model('School', SchoolSchema);

var ExamSchema = new mongoose.Schema({
    examTitle: String,
    examDate: Date,
    section: { type: Schema.Types.ObjectId, ref: 'Section' },
    attendence: Boolean,
    totalScore: Number,
    totalReceivedScore: Number,
    rank: Number,
    examProblems: [ExamProblemSchema]
}, { collection: 'exam' });

//Exam and sub-problem-object schema
var ExamProblemSchema = new mongoose.Schema({
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
    problemType: String,
    weight: Number,
    receivedScore: Number,
    studentAnswer: Array
});

var Exam = mongoose.model('Exam', ExamSchema);

//Student schema
var StudentSchema = new mongoose.Schema({
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
    comments: String
}, { collection: 'student' });

var Student = mongoose.model('Student', StudentSchema);

//Parent schema
var ParentSchema = new mongoose.Schema({
    parentName: String,
    studentIds: [
        { type: Schema.Types.ObjectId, ref: 'Student' }
    ]
}, { collection: 'parent' });

var Parent = mongoose.model('Parent', ParentSchema);

//Teacher schema
var TeacherSchema = new mongoose.Schema({
    teacherName: String,
    sections: [
        { type: Schema.Types.ObjectId, ref: 'Section' }
    ],
    schools: [
        { type: Schema.Types.ObjectId, ref: 'School' }
    ]
}, { collection: 'teacher' });

var Teacher = mongoose.model('Teacher', TeacherSchema);

//Admin schema
var AdminSchema = new mongoose.Schema({
    adminName: String,
    schools: [
        { type: Schema.Types.ObjectId, ref: 'schools' }
    ]
}, { collection: 'admin' });

var Admin = mongoose.model('Admin', AdminSchema);

//Superadmin schema
var SuperadminSchema = new mongoose.Schema({
    superadminName: String
}, { collection: 'superadmin' });

var Superadmin = mongoose.model('Superadmin', SuperadminSchema);

//User schema
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    role: Number,
    userId: { type: Schema.Types.ObjectId }   //Note: not reference
}, { collection: 'user' });

UserSchema.methods.validPassword = function (password) {
    if (password === this.password) {
        return true;
    } else {
        return false;
    }
}

var User = mongoose.model('User', UserSchema);

//Newsfeed schema
var FeedSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId },   //Note: not reference
    groupId: { type: Schema.Types.ObjectId },   //Note: not reference
    type: String,
    feedData: String,
    createdDate: Date,
    archived: Array
}, { collection: 'feed' });

var Feed = mongoose.model('Feed', FeedSchema);

//other schemas here

//exports
module.exports = {
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
    Problem: Problem,
    Exam: Exam,
    Quiz: Quiz,
    Feed: Feed
}
