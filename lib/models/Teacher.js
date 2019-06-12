const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema ({
  auth0ID: {
    type: String,
    required: true
  },
  classes: [{
    _id: mongoose.Types.ObjectId,
    ref: 'Class'
  }]
}, {
  versionKey: false
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
