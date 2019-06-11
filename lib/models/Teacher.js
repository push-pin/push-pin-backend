const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema ({
  user: {
    type: String,
    required: true
  },
  // courseId: {
  //   type: mongoose.Types.ObjectId,
  //   required: true,
  //   ref: 'User'
  // },
  // classes: [{
  //   _id: mongoose.Types.ObjectId,
  //   ref: 'Class'
  // }]
}, {
  versionKey: false
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
