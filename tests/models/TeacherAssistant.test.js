const mongoose = require('mongoose');
const TeacherAssistant = require('../../lib/models/profiles/TeacherAssistant');

describe('TeacherAssistant model', () => {
  it('new TeacherAssistant', () => {
    const teacherAssistant = new TeacherAssistant({
      auth0ID: '1234567890',
      currentClass: new mongoose.Types.ObjectId,
      pastClasses: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
    });

    expect(teacherAssistant.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      auth0ID: '1234567890',
      currentClass: expect.any(mongoose.Types.ObjectId),
      pastClasses: [expect.any(mongoose.Types.ObjectId), expect.any(mongoose.Types.ObjectId)]
    });
  });
});
