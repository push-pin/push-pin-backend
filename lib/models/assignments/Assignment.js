const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema ({
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
    require: true
  },
  type: {
    type: String,
    required: true,
    enum: ['reading', 'solo', 'mob']
  },
  title: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  dateAvailable: {
    type: Date,
    required: true
  },
  dateDue: {
    type: Date,
    required: true
  },
  dateClosed: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
  // contributors: {
  //   type: [mongoose.type.ObjectId],
  //   default: []
  // }
}, {
  versionKey: false
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
