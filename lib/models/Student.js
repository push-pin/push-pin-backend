const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema ({
  auth0Id: {
    type: String,
    required: true
  },
  currentClass: {
    type: mongoose.Types.ObjectId,
    ref: 'Class'
  },
  pastClasses: [mongoose.Schema.Types.ObjectId],
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
