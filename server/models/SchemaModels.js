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

//other schemas here

//exports
module.exports = {
  User: User,
  Problem: Problem,
  Student: Student,
  Teacher: Teacher,
  School: School
}