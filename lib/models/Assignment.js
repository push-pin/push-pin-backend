const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema ({
  // classId: {
  //   _id: mongoose.Types.ObjectId,
  //   ref: 'Class',
  //   require: true
  // },
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
  // contributors: {
  //   type: [mongoose.type.ObjectId],
  //   default: []
  // }
}, {
  versionKey: false
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
