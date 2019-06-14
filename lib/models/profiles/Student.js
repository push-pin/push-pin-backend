const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema ({
  userId: {
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
  }
}, {
  versionKey: false
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
