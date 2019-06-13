const Unit = require('../../lib/models/Unit');
const mongoose = require('mongoose');

describe('Unit model', () => {
  it('new Unit', () => {
    const newUnit = new Unit({
      course: new mongoose.Types.ObjectId,
      year: '2019',
      startDate: new Date(),
      endDate: new Date(),
    });

    expect(newUnit.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      course: expect.any(mongoose.Types.ObjectId),
      year: '2019',
      startDate: expect.any(Date),
      endDate: expect.any(Date),
    });
  });
});
