const Assignment = require('../../lib/models/Assignment');
const mongoose = require('mongoose');

describe('Assignment model', () => {
  it('new Assignment', () => {
    const assignment = new Assignment({
      type: 'solo',
      instructions: 'Do this work',
      dateAvailable: new Date(),
      dateDue: new Date(),
      dateClosed: new Date()
    });

    expect(assignment.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      type: 'solo',
      instructions: 'Do this work',
      dateAvailable: expect.any(Date),
      dateDue: expect.any(Date),
      dateClosed: expect.any(Date)
    });
  });
});
