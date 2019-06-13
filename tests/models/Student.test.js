const Student = require('../../lib/models/profiles/Student');
const mongoose = require('mongoose');

describe('Student model', () => {
  it('new Student', () => {
    const student = new Student({
      userId: new mongoose.Types.ObjectId,
      currentClass: new mongoose.Types.ObjectId,
      pastClasses: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
    });

    expect(student.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      userId: expect.any(mongoose.Types.ObjectId),
      currentClass: expect.any(mongoose.Types.ObjectId),
      pastClasses: [expect.any(mongoose.Types.ObjectId), expect.any(mongoose.Types.ObjectId)],
      attendance: 0
    });
  });
});
