var mongoose = require("mongoose");

//User schema
var UserSchema = new mongoose.Schema({ 
    id: {
      type: String,
      unique: true
    },
    username: {
    	type: String,
    	unique: true
    },
    password: String,
    role: Number
}, { collection : 'user' });

UserSchema.methods.validPassword = function (password) {
  if (password === this.password) {
    return true; 
  } else {
    return false;
  }
}

var User = mongoose.model('User', UserSchema);

//Problem schema
var ProblemSchema = new mongoose.Schema({
    problemUUID: {
      type: String,
      unique: true
    },
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
}, { collection : 'problem' });

var Problem = mongoose.model('Problem', ProblemSchema);

//Exam and sub-problem-object schema
var ExamProblemSchema = new mongoose.Schema({ 
    problemUUID: {
      type: String,
      unique: true
    },
    problemType: String,
    weight: Number,
    receivedScore: Number,
    studentAnswer: Array
});

var ExamSchema = new mongoose.Schema({ 
    examUUID: {
      type: String,
      unique: true
    },
    examTitle: String,
    examDate: Date,
    section: String,
    attendence: Boolean,
    totalScore: Number,
    totalReceivedScore: Number,
    rank: Number,
    examProblems: [ExamProblemSchema]
}, { collection : 'exam' });

var Exam = mongoose.model('Exam', ExamSchema);

//Student schema
var StudentSchema = new mongoose.Schema({ 
    userUUID: {
      type: String,
      unique: true
    },
    studentName: String,
    sections: Array,
    schools: Array,
    exams: Array
}, { collection : 'student' });

var Student = mongoose.model('Student', StudentSchema);

//Teacher schema
var TeacherSchema = new mongoose.Schema({ 
    userUUID: {
      type: String,
      unique: true
    },
    teacherName: String,
    sections: Array,
    schools: Array
}, { collection : 'teacher' });

var Teacher = mongoose.model('Teacher', TeacherSchema);

//School schema
var SchoolSchema = new mongoose.Schema({ 
    schoolUUID: {
      type: String,
      unique: true
    },
    schoolName: String,
    sections: Array
}, { collection : 'school' });

var School = mongoose.model('School', SchoolSchema);

//Section schema
var SectionSchema = new mongoose.Schema({ 
    sectionUUID: {
      type: String,
      unique: true
    },
    sectionName: String
}, { collection : 'section' });

var Section = mongoose.model('Section', SectionSchema);

//other schemas here

//exports
module.exports = {
  User: User,
  Problem: Problem,
  Student: Student,
  Teacher: Teacher,
  School: School,
  Section: Section,
  Exam: Exam
}