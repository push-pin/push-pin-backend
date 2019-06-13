const Student = require('../../lib/models/profiles/Student');
const mongoose = require('mongoose');

describe('Student model', () => {
  it('new Student', () => {
    const student = new Student({
      auth0Id: '1234567890987654321',
      currentClass: new mongoose.Types.ObjectId,
      pastClasses: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
    });

    expect(student.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      auth0Id: expect.any(String),
      currentClass: expect.any(mongoose.Types.ObjectId),
      pastClasses: [expect.any(mongoose.Types.ObjectId), expect.any(mongoose.Types.ObjectId)],
      attendance: 0
    });
  });
});
