const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema ({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classes: [mongoose.Schema.Types.ObjectId]
}, {
  versionKey: false
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;