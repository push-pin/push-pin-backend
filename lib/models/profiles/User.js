const mongoose = require('mongoose');
const Student = require('./Student');
const Teacher = require('./Teacher');
const TeacherAssistant = require('./TeacherAssistant');
const { STUDENT, TEACHER, TA } = require('../userRoles');

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
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: [STUDENT, TEACHER, TA],
    required: true
  },
  image: {
    type: String,
    default: '../..//assets/placeholder.png'
  }
}, {
  versionKey: false
});

userSchema.methods.getProfile = function(){
  switch(this.role) {
    case 'student':
      return Student.findOne({ user: this._id })
        .lean()
        .then(student => ({
          ...student,
          firstName: this.firstName,
          lastName: this.lastName,
          user: this._id,
          auth0id: this.auth0id,
          role: 'student'
        }));
    case 'teacher':
      return Teacher.findOne({ user: this._id })
        .lean()
        .then(teacher => ({
          ...teacher,
          firstName: this.firstName,
          lastName: this.lastName,
          user: this._id,
          auth0id: this.auth0id,
          role: 'teacher'
        }));
    case 'ta':
      return TeacherAssistant.findOne({ user: this._id })
        .lean()
        .then(ta => ({
          ...ta,
          firstName: this.firstName,
          lastName: this.lastName,
          user: this._id,
          auth0id: this.auth0id,
          role: 'ta'
        }));
    default:
      return null;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
