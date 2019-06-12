const Grade = require('../../lib/models/Grade');
const mongoose = require('mongoose');

describe('Grade model', () => {
  it('new Grade', () => {
    const grade = new Grade({
      submission: new mongoose.Types.ObjectId,
      grade: 10,
      comment: 'good job',
      grader: new mongoose.Types.ObjectId
    });

    expect(grade.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      submission: expect.any(mongoose.Types.ObjectId),
      grade: 10,
      comment: 'good job',
      grader: expect.any(mongoose.Types.ObjectId)
    });
  });
});
