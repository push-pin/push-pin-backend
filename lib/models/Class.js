const mongoose = require('mongoose');

const classSchema = new mongoose.Schema ({
  course: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Course'
  },
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    require: true
  },
  endDate: {
    type: Date,
    require: true
  }
}, {
  versionKey: false
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
