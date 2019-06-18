const Assignment = require('../../lib/models/assignments/Assignment');
const mongoose = require('mongoose');

describe('Assignment model', () => {
  it('new Assignment', () => {
    const assignment = new Assignment({
      type: 'solo',
      instructions: 'Do this work',
      course: new mongoose.Types.ObjectId,
      dateAvailable: new Date(),
      dateDue: new Date(),
      dateClosed: new Date(),
      pointsPossible: 50
    });

    expect(assignment.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      type: 'solo',
      active: true,
      instructions: 'Do this work',
      course: expect.any(mongoose.Types.ObjectId),
      dateAvailable: expect.any(Date),
      dateDue: expect.any(Date),
      dateClosed: expect.any(Date),
      pointsPossible: 50
    });
  });
});
