const mongoose = require('mongoose');

const teacherAssistantSchema = new mongoose.Schema ({
  auth0ID: {
    type: String,
    required: true
  },
  currentClass: {
    type: mongoose.Types.ObjectId,
    ref: 'Class'
  },
  pastClasses: [mongoose.Schema.Types.ObjectId]
}, {
  versionKey: false
});

const TeacherAssistant = mongoose.model('TeacherAssistant', teacherAssistantSchema);

module.exports = TeacherAssistant;