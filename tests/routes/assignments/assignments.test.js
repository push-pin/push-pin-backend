require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { seedAsses } = require('../../utils/seed-data');
const Assignment = require('../../../lib/models/assignments/Assignment');
const Course = require('../../../lib/models/Course');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => {
  return await Promise.all([seedAsses()]);
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
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String),
          active: true
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
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String),
          active: true
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
      dateAvailable: new Date(),
      dateDue: new Date(),
      dateClosed: new Date(),
      active: false
    });
    await Assignment.create({
      course: course[0]._id,
      type: 'solo',
      title: 'Do this thing',
      instructions: 'fork the repo and do the lab',
      dateAvailable: new Date(),
      dateDue: new Date(),
      dateClosed: new Date(),
      active: false
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
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String),
          active: false
        });
      });
  });

  it('gets an assignment by id', async() => {
    const ass = await Assignment.create({
      course: new mongoose.Types.ObjectId,
      type: 'reading',
      title: 'Read this thing',
      instructions: 'Read pages 1-10 and answer the questions',
      dateAvailable: new Date(),
      dateDue: new Date(),
      dateClosed: new Date()
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
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String),
        });
      });
  });

  it('updates an assignment', async() => {
    const ass = await Assignment.create({
      course: new mongoose.Types.ObjectId,
      type: 'reading',
      title: 'Read this thing',
      instructions: 'Read pages 1-10 and answer the questions',
      dateAvailable: new Date(),
      dateDue: new Date(),
      dateClosed: new Date()
    });
    return request(app)
      .patch(`/api/v1/assignments/${ass._id}`)
      .send({
        title: 'Hello there!'
      })
      .then(res => {
        expect(res.body).toEqual({
          course: expect.any(String),
          _id: expect.any(String),
          type: 'reading',
          title: 'Hello there!',
          instructions: 'Read pages 1-10 and answer the questions',
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String),
          active: true
        });
      });
  });

});
