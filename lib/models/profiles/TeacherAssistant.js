const mongoose = require('mongoose');

const teacherAssistantSchema = new mongoose.Schema ({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentCourse: {
    type: mongoose.Types.ObjectId,
    ref: 'Class'
  },
  pastCourses: [mongoose.Schema.Types.ObjectId]
}, {
  versionKey: false
});

const TeacherAssistant = mongoose.model('TeacherAssistant', teacherAssistantSchema);

module.exports = TeacherAssistant;
