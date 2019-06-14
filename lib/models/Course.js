const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true
  },
  term: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    require: true
  },
  endDate: {
    type: Date,
    require: true
  },
  courseType: {
    type: String,
    required: true,
    enum: ['BootCamp1', 'BootCamp2', 'CareerTrack']
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  versionKey: false
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
