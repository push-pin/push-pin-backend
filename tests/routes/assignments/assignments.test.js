require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { seedAsses, seedStudents } = require('../../utils/seed-data');
const Assignment = require('../../../lib/models/assignments/Assignment');
const Course = require('../../../lib/models/Course');
const Submission = require('../../../lib/models/assignments/Submission');
const User = require('../../../lib/models/profiles/User');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(() => {
  return Promise.all([
    seedAsses(),
    seedStudents()
  ]);
});

afterAll(() => mongoose.connection.close());

describe('assignment route tests', () => {

  it('create a new assignment', () => {
    return request(app)
      .post('/api/v1/assignments/')
      .send({
        course: new mongoose.Types.ObjectId,
        type: 'reading',
        title: 'Read this thing',
        instructions: 'Read pages 1-10 and answer the questions',
        classDate: new Date(),
        dateAvailable: new Date(),
        dateDue: new Date(),
        dateClosed: new Date()
      })
      .then(res => {
        expect(res.body).toEqual({
          course: expect.any(String),
          _id: expect.any(String),
          type: 'reading',
          title: 'Read this thing',
          instructions: 'Read pages 1-10 and answer the questions',
          classDate: expect.any(String),
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String),
          active: true,
          pointsPossible: 5
        });
      });
  });

  it('gets all active assignments for a course', async() => {
    const course = await Course.find();
    return request(app)
      .get(`/api/v1/assignments/course/${course[0]._id}`)
      .then(res => {
        expect(res.body).toHaveLength(20);
        expect(res.body[0]).toEqual({
          course: expect.any(String),
          _id: expect.any(String),
          type: expect.any(String),
          title: expect.any(String),
          instructions: expect.any(String),
          classDate: expect.any(String),
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String),
          active: true,
          pointsPossible: expect.any(Number)
        });
      });
  });

  it('gets all archived assignments for a course', async() => {
    const course = await Course.find();
    await Assignment.create({
      course: course[0]._id,
      type: 'reading',
      title: 'Read this thing',
      instructions: 'Read pages 1-10 and answer the questions',
      classDate: new Date(),
      dateAvailable: new Date(),
      dateDue: new Date(),
      dateClosed: new Date(),
      active: false,
      pointsPossible: 10
    });
    await Assignment.create({
      course: course[0]._id,
      type: 'solo',
      title: 'Do this thing',
      instructions: 'fork the repo and do the lab',
      classDate: new Date(),
      dateAvailable: new Date(),
      dateDue: new Date(),
      dateClosed: new Date(),
      active: false,
      pointsPossible: 10
    });
    return request(app)
      .get(`/api/v1/assignments/course/inactive/${course[0]._id}`)
      .then(res => {
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toEqual({
          course: expect.any(String),
          _id: expect.any(String),
          type: expect.any(String),
          title: expect.any(String),
          instructions: expect.any(String),
          classDate: expect.any(String),
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String),
          active: false,
          pointsPossible: expect.any(Number)
        });
      });
  });

  it('gets an assignment by id', async() => {
    const ass = await Assignment.create({
      course: new mongoose.Types.ObjectId,
      type: 'reading',
      title: 'Read this thing',
      instructions: 'Read pages 1-10 and answer the questions',
      classDate: new Date(),
      dateAvailable: new Date(),
      dateDue: new Date(),
      dateClosed: new Date(),
      pointsPossible: 5
    });
    return request(app)
      .get(`/api/v1/assignments/${ass._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          active: true,
          course: expect.any(String),
          type: 'reading',
          title: 'Read this thing',
          instructions: 'Read pages 1-10 and answer the questions',
          classDate: expect.any(String),
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String),
          pointsPossible: 5
        });
      });
  });

  it('updates an assignment', async() => {
    const ass = await Assignment.create({
      course: new mongoose.Types.ObjectId,
      type: 'reading',
      title: 'Read this thing',
      instructions: 'Read pages 1-10 and answer the questions',
      classDate: new Date(),
      dateAvailable: new Date(),
      dateDue: new Date(),
      dateClosed: new Date(),
      pointsPossible: 5
    });
    return request(app)
      .patch(`/api/v1/assignments/${ass._id}`)
      .send({
        title: 'Hello there!',
        pointsPossible: 10
      })
      .then(res => {
        expect(res.body).toEqual({
          course: expect.any(String),
          _id: expect.any(String),
          type: 'reading',
          title: 'Hello there!',
          instructions: 'Read pages 1-10 and answer the questions',
          classDate: expect.any(String),
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String),
          active: true,
          pointsPossible: 10
        });
      });
  });

  it('gets all asses in one week', async() => {
    const CAUS = await createCAUS();
    
    return request(app)
      .get(`/api/v1/assignments/weekataglance/course/${CAUS.course._id}/student/${CAUS.user._id}`)
      .then(res => {
        expect(res.body).toEqual({
          weeksAsses: expect.any(Object),
          matchingSubs: expect.any(Array)
        });
        expect(res.body.weeksAsses).toEqual({
          mon: expect.any(Array),
          tues: expect.any(Array),
          wed: expect.any(Array),
          thurs: expect.any(Array),
          fri: expect.any(Array)
        });
        expect(res.body.matchingSubs[0]).toEqual({
          graded: false,
          _id: expect.any(String),
          assignment: expect.any(String),
          student: expect.any(String),
          submission: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        });
      });
  });

  it('gets all asses in course and subs by user in course', async() => {
    const CAUS = await createCAUS();
    return request(app)
      .get(`/api/v1/assignments/courseassignments/course/${CAUS.course._id}/student/${CAUS.user._id}`)
      .then(res => {
        expect(res.body.asses).toEqual(expect.any(Array));
        expect(res.body.subs).toEqual(expect.any(Array));
        expect(res.body.asses[0]).toEqual({
          _id: expect.any(String),
          active: expect.any(Boolean),
          course: expect.any(String),
          dateAvailable: expect.any(String),
          dateClosed: expect.any(String),
          dateDue: expect.any(String),
          instructions: expect.any(String),
          pointsPossible: expect.any(Number),
          title: expect.any(String),
          type: expect.any(String),
        });
        expect(res.body.subs[0]).toEqual({
          _id: expect.any(String),
          graded: false,
          assignment: {
            _id: expect.any(String),
            active: true,
            course: expect.any(String),
            type: expect.any(String),
            title: expect.any(String),
            instructions: expect.any(String),
            dateAvailable: expect.any(String),
            dateDue: expect.any(String),
            dateClosed: expect.any(String),
            pointsPossible: expect.any(Number)
          },
          student: expect.any(String),
          submission: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        });
      });
  });
});


const createCAUS = async() => {
  const course = await Course.findOne();
  const ass = await Assignment.create({
    course: course._id,
    type: 'reading',
    title: 'Read this thing',
    instructions: 'Read pages 1-10 and answer the questions',
    dateAvailable: new Date(),
    dateDue: new Date(),
    dateClosed: new Date(),
    pointsPossible: 10
  });
  const user = await User.findOne();
  // eslint-disable-next-line no-unused-vars
  const sub = await Submission
    .create({
      assignment: ass._id,
      student: user._id,
      submission: 'my submission for the ass',
    });
  return { course, ass, user, sub };
};
