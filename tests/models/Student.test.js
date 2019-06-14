const Student = require('../../lib/models/profiles/Student');
const mongoose = require('mongoose');

describe('Student model', () => {
  it('new Student', () => {
    const student = new Student({
      user: new mongoose.Types.ObjectId,
      currentCourse: new mongoose.Types.ObjectId,
      pastCourses: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
    });

    expect(student.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      user: expect.any(mongoose.Types.ObjectId),
      currentCourse: expect.any(mongoose.Types.ObjectId),
      pastCourses: [expect.any(mongoose.Types.ObjectId), expect.any(mongoose.Types.ObjectId)],
      attendance: 0
    });
  });
});
