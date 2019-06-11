const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema ({
  submission: {
    type: String,
    required: true
  },
  grade: {
    type: Number
  },
  gradeComment: {
    type: String
  },
  graded: {
    type: Boolean,
    default: false
  },
  gradedBy: {
    type: mongoose.Types.ObjectId
  }
}, {
  versionKey: false
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
