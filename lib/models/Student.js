const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema ({
  user: {
    type: String,
    required: true
  },
  overallGrade: {
    type: Number
  }
}, {
  versionKey: false
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
