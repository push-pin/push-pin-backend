const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema ({
  course: {
    type: String,
    required: true,
    enum: ['BootCamp1', 'BootCamp2', 'CareerTrack']
  }
}, {
  versionKey: false
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;