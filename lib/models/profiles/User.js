const mongoose = require('mongoose');
const Student = require('./Student');
const Teacher = require('./Teacher');
const TeacherAssistant = require('./TeacherAssistant');

const userSchema = new mongoose.Schema({
  auth0id: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'ta'],
    required: true
  }
}, {
  versionKey: false
});

userSchema.methods.getProfile = function(){
  switch(this.role) {
    case 'student':
      return Student.findOne({ userId: this._id })
        .lean()
        .then(student => ({
          ...student,
          firstName: this.firstName,
          lastName: this.lastName
        }));
    case 'teacher':
      return Teacher.findOne({ userId: this._id })
        .lean();
    case 'ta':
      return TeacherAssistant.findOne({ userId: this._id })
        .lean();
    default:
      return null;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
