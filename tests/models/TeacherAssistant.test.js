const mongoose = require('mongoose');
const TeacherAssistant = require('../../lib/models/profiles/TeacherAssistant');

describe('TeacherAssistant model', () => {
  it('new TeacherAssistant', () => {
    const teacherAssistant = new TeacherAssistant({
      userID: new mongoose.Types.ObjectId,
      currentCourse: new mongoose.Types.ObjectId,
      pastCourses: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
    });

    expect(teacherAssistant.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      userID: expect.any(mongoose.Types.ObjectId),
      currentCourse: expect.any(mongoose.Types.ObjectId),
      pastCourses: [expect.any(mongoose.Types.ObjectId), expect.any(mongoose.Types.ObjectId)]
    });
  });
});
