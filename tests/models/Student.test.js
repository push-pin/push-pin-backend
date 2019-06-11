const Teacher = require('../../lib/models/Teacher');
const mongoose = require('mongoose');

describe('Teacher model', () => {
  it('new Teacher', () => {
    const teacher = new Teacher({
      user: '1234567890987654321',
    });

    expect(teacher.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      user: expect.any(String)
    });
  });
});
