const Submission = require('../../lib/models/assignments/Submission');
const mongoose = require('mongoose');

describe('Submission model', () => {
  it('new Submission', () => {
    const submission = new Submission({
      assignment: new mongoose.Types.ObjectId,
      submission: 'github.com',
      graded: false,
      student: new mongoose.Types.ObjectId
    });

    expect(submission.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      assignment: expect.any(mongoose.Types.ObjectId),
      student: expect.any(mongoose.Types.ObjectId),
      submission: 'github.com',
      graded: false
    });
  });
});
