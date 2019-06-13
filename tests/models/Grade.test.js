const mongoose = require('mongoose');
const Grade = require('../../lib/models/assignments/Grade');

describe('Grade model', () => {
  it('new Grade', () => {
    const grade = new Grade({
      submission: new mongoose.Types.ObjectId,
      grade: 10,
      grader: new mongoose.Types.ObjectId
    });

    expect(grade.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      submission: expect.any(mongoose.Types.ObjectId),
      grade: 10,
      grader: expect.any(mongoose.Types.ObjectId)
    });
  });
});
