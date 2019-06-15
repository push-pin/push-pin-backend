const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const commentSchema = new mongoose.Schema ({
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
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  versionKey: false
});

commentSchema.plugin(timestamp);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
