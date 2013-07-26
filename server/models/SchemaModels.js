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

//Quiz and sub-problem-object schema
var QuizProblemSchema = new mongoose.Schema({ 
    problemUUID: {
      type: String,
      unique: true
    },
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
}, { collection : 'quiz' });

var Quiz = mongoose.model('Quiz', QuizSchema);

//Student schema
var StudentSchema = new mongoose.Schema({ 
    userUUID: {
      type: String,
      unique: true
    },
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    sex: String,
    email: String,
    phone: Array,
    address: String,
    profilePic: String,
    sections: Array,
    schools: Array,
    exams: Array,
    comments: String
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
    sectionName: String,
    sectionUnits: Array
}, { collection : 'section' });

var Section = mongoose.model('Section', SectionSchema);

//Unit schema
var UnitSchema = new mongoose.Schema({ 
    unitUUID: {
      type: String,
      unique: true
    },
    unitName: String,
    comment: String,
    father: Array,
    child: Array,
    items: Array
}, { collection : 'unit' });

var Unit = mongoose.model('Unit', UnitSchema);

//Material schema
var MaterialSchema = new mongoose.Schema({ 
    materialUUID: {
      type: String,
      unique: true
    },
    materialName: String,
    comment: String,
    dateOfCreation: Date,
    dateOfModification: Date,
    lastEditedBy: String,
    sourceUrl: String,
    materialType: String
}, { collection : 'material' });

var Material = mongoose.model('Material', MaterialSchema);

//other schemas here

//exports
module.exports = {
  User: User,
  Problem: Problem,
  Student: Student,
  Teacher: Teacher,
  School: School,
  Section: Section,
  Exam: Exam,
  Quiz: Quiz,
  Unit: Unit,
  Material: Material
}