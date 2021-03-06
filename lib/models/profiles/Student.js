const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema ({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentCourse: {
    type: mongoose.Types.ObjectId,
    ref: 'Course'
  },
  pastCourses: [mongoose.Schema.Types.ObjectId],
  overallGrade: {
    type: Number
  },
  attendance: {
    type: Number,
    default: 0,
  }, 
  grader: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  versionKey: false
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
