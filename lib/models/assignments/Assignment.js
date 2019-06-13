const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema ({
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: 'Class',
    require: true
  },
  type: {
    type: String,
    required: true,
    enum: ['reading', 'solo', 'mob']
  },
  instructions: {
    type: String,
    required: true
  },
  dateAvailable: {
    type: Date
  },
  dateDue: {
    type: Date
  },
  dateClosed: {
    type: Date
  },
  // contributors: {
  //   type: [mongoose.type.ObjectId],
  //   default: []
  // }
}, {
  versionKey: false
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
