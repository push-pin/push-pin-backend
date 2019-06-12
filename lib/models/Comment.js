const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema ({
  submission: {
    type: mongoose.Types.ObjectId,
    required: true,
    red: 'Submission'
  },
  comment: {
    type: String,
    required: true
  },
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  versionKey: false
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
