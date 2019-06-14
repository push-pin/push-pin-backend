const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema ({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courses: [mongoose.Schema.Types.ObjectId]
}, {
  versionKey: false
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
