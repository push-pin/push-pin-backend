const mongoose = require('mongoose');
const Student = require('./Student');
const Teacher = require('./Teacher');
const TeacherAssistant = require('./TeacherAssistant');

const userSchema = new mongoose.Schema({
  auth0id: {
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

userSchema.methods.getProfile = () => {
  if(this.role === 'student') {
    return Student.findOne({ userId: this._id })
      .lean();
  }
  else if(this.role === 'teacher') {
    return Teacher.findOne({ userId: this._id })
      .lean();
  }
  else if(this.role === 'ta') {
    return TeacherAssistant.findOne({ userId: this._id })
      .lean();
  }
};
