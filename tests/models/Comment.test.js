const mongoose = require('mongoose');
const Comment = require('../../lib/models/assignments/Comment');

describe('Comment model', () => {
  it('new Comment', () => {
    const comment = new Comment({
      submission: new mongoose.Types.ObjectId,
      comment: 'You did so gosh dang good',
      commenter: new mongoose.Types.ObjectId
    });

    expect(comment.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      submission: expect.any(mongoose.Types.ObjectId),
      comment: 'You did so gosh dang good',
      commenter: expect.any(mongoose.Types.ObjectId)
    });
  });
  it('get comments by submission', () => {
    const comment = new Comment({
      submission: new mongoose.Types.ObjectId,
      comment: 'You did so gosh dang good',
      commenter: new mongoose.Types.ObjectId
    });

    expect(comment.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      submission: expect.any(mongoose.Types.ObjectId),
      comment: 'You did so gosh dang good',
      commenter: expect.any(mongoose.Types.ObjectId)
    });
  });
});
