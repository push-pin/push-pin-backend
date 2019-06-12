const Submission = require('../../lib/models/Submission');
const mongoose = require('mongoose');

describe('Submission model', () => {
  it('new Submission', () => {
    const submission = new Submission({
      assignment: new mongoose.Types.ObjectId,
      submission: 'github.com',
      graded: false
    });

    expect(submission.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      assignment: expect.any(mongoose.Types.ObjectId),
      submission: 'github.com',
      comments: [],
      graded: false
    });
  });
});
