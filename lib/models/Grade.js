const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema ({
  submission: {
    type: mongoose.Types.ObjectId,
    required: true,
    red: 'Submission'
  },
  grade: {
    type: Number,
    require: true
  },
  comment: {
    type: String,
    required: true
  },
  grader: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'TeacherAssistant'
  }
}, {
  versionKey: false
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
