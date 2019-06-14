const Course = require('../../lib/models/Course');
const mongoose = require('mongoose');

describe('Course model', () => {
  it('new Course', () => {
    const course = new Course({
      name: 'Fullstack JavaScript',
      term: 'Spring 2019',
      startDate: new Date(),
      endDate: new Date(),
      courseType: 'CareerTrack'
    });

    expect(course.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Fullstack JavaScript',
      term: 'Spring 2019',
      startDate: expect.any(Date),
      endDate: expect.any(Date),
      courseType: 'CareerTrack'
    });
  });
});
