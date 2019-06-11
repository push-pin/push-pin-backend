const Submission = require('../../lib/models/Submission');
const mongoose = require('mongoose');

describe('Submission model', () => {
  it('new Submission', () => {
    const submission = new Submission({
      submission: 'github.com',
      grade: null,
      gradeComment: '',
      graded: false,
      gradedBy: new mongoose.Types.ObjectId
    });

    expect(submission.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      submission: 'github.com',
      grade: null,
      gradeComment: '',
      graded: false,
      gradedBy: expect.any(mongoose.Types.ObjectId)
    });
  });
});
