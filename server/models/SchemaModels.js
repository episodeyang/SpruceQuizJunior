var mongoose = require("mongoose");

//User schema
var UserSchema = new mongoose.Schema({ 
    id: Number,
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

//Problems schema
//to be added soon based on notes

//other schemas here

//exports
module.exports = {
  User: User
}