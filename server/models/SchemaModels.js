var mongoose = require("mongoose");

//User schema
var UserSchema = new mongoose.Schema({ 
    id: {
      type: Number,
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

//other schemas here

//exports
module.exports = {
  User: User,
  Problem: Problem
}