const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema ({
  assignment: {
    type: mongoose.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  submission: {
    type: String,
    required: true
  },
  graded: {
    type: Boolean,
    default: false
  }
}, {
  versionKey: false
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
