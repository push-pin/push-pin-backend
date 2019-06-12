const mongoose = require('mongoose');

const teacherAssistantSchema = new mongoose.Schema ({
  auth0ID: {
    type: String,
    required: true
  },
  currentClass: {
    _id: mongoose.Types.ObjectId,
    ref: 'Class'
  },
  pastClasses: [{
    _id: mongoose.Types.ObjectId,
    ref: 'Class'
  }]
}, {
  versionKey: false
});

const TeacherAssistant = mongoose.model('TeacherAssistant', teacherAssistantSchema);

module.exports = TeacherAssistant;
