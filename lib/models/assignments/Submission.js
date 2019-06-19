const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const submissionSchema = new mongoose.Schema ({
  assignment: {
    type: mongoose.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
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

submissionSchema.plugin(timestamp);
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
