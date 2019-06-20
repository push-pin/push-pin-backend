require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const Course = require('../../../lib/models/Course');
const Assignment = require('../../../lib/models/assignments/Assignment');
const User = require('../../../lib/models/profiles/User');
const Submission = require('../../../lib/models/assignments/Submission');
const { seedSubmissions, seedGrades } = require('../../utils/seed-data');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => seedSubmissions());

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
    await mongoose.connection.dropDatabase(); 
    await seedGrades();
    const student = await User.findOne({ role: 'student' }); 

    return request(app)
      .get(`/api/v1/submissions/student/${student._id}`)
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body[0]).toEqual({
          submission: {
            graded: true, 
            _id: expect.any(String),
            assignment: expect.any(String),
            student: expect.any(String),
            submission: expect.any(String),
            updatedAt: expect.any(String),
            createdAt: expect.any(String)
          },
          grade: expect.any(Object)
        });
      });
  });  

  it('gets all subs by ass id', async() => {
    const ass = await Assignment.findOne();
    return request(app)
      .get(`/api/v1/submissions/assignment/${ass._id}`)
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body[0]).toEqual({
          graded: expect.any(Boolean),
          _id: expect.any(String),
          assignment: expect.any(String),
          student: {
            _id: expect.any(String),
            image: '../..//assets/placeholder.png',
            auth0id: expect.any(String),
            role: 'student',
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String)
          },
          submission: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        });
      });
  });  

  it('updates submission', async() => {
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

  it.only('gets 20 most recently submitted assignments for a course', async() => {
    const course = await Course.findOne();
    return request(app)
      .get(`/api/v1/submissions/recent/${course._id}`)
      .then(res => {
        expect(res.body).toHaveLength(20);
        expect(res.body[0]).toEqual({
          graded: expect.any(Boolean),
          _id: expect.any(String),
          assignment: {
            _id: expect.any(String),
            title: expect.any(String)
          },
          student: {
            _id: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
          },
          submission: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        });
      });
  });

  
});


