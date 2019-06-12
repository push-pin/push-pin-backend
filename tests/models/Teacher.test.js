const Teacher = require('../../lib/models/Teacher');
const mongoose = require('mongoose');

describe('Teacher model', () => {
  it('new teacher', () => {
    const teacher = new Teacher({
      auth0Id: '1234567890987654321',
      classes: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
    });

    expect(teacher.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      auth0Id: expect.any(String),
      classes: [expect.any(mongoose.Types.ObjectId), expect.any(mongoose.Types.ObjectId)]
    });
  });
});
