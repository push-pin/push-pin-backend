const Teacher = require('../../lib/models/profiles/Teacher');
const mongoose = require('mongoose');

describe('Teacher model', () => {
  it('new teacher', () => {
    const teacher = new Teacher({
      userId: new mongoose.Types.ObjectId,
      courses: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
    });

    expect(teacher.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      userId: expect.any(mongoose.Types.ObjectId),
      courses: [expect.any(mongoose.Types.ObjectId), expect.any(mongoose.Types.ObjectId)]
    });
  });
});
