const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const gradeSchema = new mongoose.Schema ({
  submission: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Submission'
  },
  comment: {
    type: String,
    required: true
  },
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
    //need a ref ???
  }
}, {
  versionKey: false
});

gradeSchema.plugin(timestamp);
const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
