require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const Assignment = require('../../../lib/models/assignments/Assignment');
const User = require('../../../lib/models/profiles/User');
const Submission = require('../../../lib/models/assignments/Submission');
const { seedSubmissions } = require('../../utils/seed-data');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(() => seedSubmissions());

afterAll(() => mongoose.connection.close());

describe('submission route tests', () => {

  it('creates new submission', async() => {
    const ass = await Assignment.findOne();
    const user = await User.findOne();

    return request(app)
      .post('/api/v1/submissions')
      .send({
        assignment: ass._id,
        student: user._id,
        submission: 'heres my cool work i did',
      })
      .then(res => {
        expect(res.body).toEqual({
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

  it('gets sub by id', async() => {
    const sub = await Submission.findOne();

    return request(app)
      .get(`/api/v1/submissions/${sub._id}`)
      .then(res => {
        expect(res.body).toEqual({
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

  it('gets all subs by student id', async() => {
    const student = await User.findOne();

    return request(app)
      .get(`/api/v1/submissions/student/${student._id}`)
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body[0]).toEqual({
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

  it('gets all subs by student id', async() => {
    const sub = await Submission.findOne();

    return request(app)
      .patch(`/api/v1/submissions/${sub._id}`)
      .send({
        submission: 'new submisstion stuff'
      })
      .then(res => {
        expect(res.body).toEqual({
          graded: false,
          _id: expect.any(String),
          assignment: expect.any(String),
          student: expect.any(String),
          submission: 'new submisstion stuff',
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        });
      });
  });  

  
});


