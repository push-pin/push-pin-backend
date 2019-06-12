const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema ({
  auth0Id: {
    type: String,
    required: true
  },
  classes: [mongoose.Schema.Types.ObjectId]
}, {
  versionKey: false
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
