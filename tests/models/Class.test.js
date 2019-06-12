const Class = require('../../lib/models/Class');
const mongoose = require('mongoose');

describe('Class model', () => {
  it('new Class', () => {
    const newClass = new Class({
      course: new mongoose.Types.ObjectId,
      year: '2019',
      startDate: new Date(),
      endDate: new Date(),
    });

    expect(newClass.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      course: expect.any(mongoose.Types.ObjectId),
      year: '2019',
      startDate: expect.any(Date),
      endDate: expect.any(Date),
    });
  });
});
