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
    ref: 'Student',
    required: true
  },
  submission: {
    type: String,
    required: true
  },
  graded: {
    type: Boolean,
    default: false
  },
  comments: [mongoose.Schema.Types.ObjectId]
}, {
  versionKey: false
});

submissionSchema.plugin(timestamp);
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;