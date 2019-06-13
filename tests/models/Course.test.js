const Course = require('../../lib/models/Course');
const mongoose = require('mongoose');

describe('Course model', () => {
  it('new Course', () => {
    const course = new Course({
      course: 'Bootcamp1',
    });

    expect(course.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      course: 'Bootcamp1',
    });
  });
});
