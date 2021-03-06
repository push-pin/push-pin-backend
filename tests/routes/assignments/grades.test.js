require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { seedGrades, seedGradesForAgg } = require('../../utils/seed-data');
const Grade = require('../../../lib/models/assignments/Grade');
const Submission = require('../../../lib/models/assignments/Submission');
const Course = require('../../../lib/models/Course');
const User = require('../../../lib/models/profiles/User');
const Assignment = require('../../../lib/models/assignments/Assignment');
const chance = require('chance').Chance();

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => {
  return await Promise.all([seedGrades()]);
});

afterAll(() => mongoose.connection.close());

describe('grade route tests', () => {

  it('posts a new grade', () => {
    return request(app)
      .post('/api/v1/grades/')
      .send({
        submission: new mongoose.Types.ObjectId,
        grade: 98,
        grader: new mongoose.Types.ObjectId
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          submission: expect.any(String),
          grader: expect.any(String),
          grade: 98,
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        });
      }); 
  }); 

  it('gets the grade for a submission', async() => {
    const sub = await Submission.findOne();
    return request(app)
      .get(`/api/v1/grades/${sub._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          submission: expect.any(String),
          grader: expect.any(String),
          grade: expect.any(Number),
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        });
      });
  });

  it('updates a grade by grade id', async() => {
    const grade = await Grade.create({
      submission: new mongoose.Types.ObjectId,
      grade: 98,
      grader: new mongoose.Types.ObjectId
    });
    return request(app)
      .patch(`/api/v1/grades/${grade._id}`)
      .send({ grade: 50 })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          submission: expect.any(String),
          grader: expect.any(String),
          grade: 50,
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        });
      });
  });

  it('gets all grades grouped by assignment', async() => {
    await seedGrades();
    return request(app)
      .get('/api/v1/grades/assignments')
      .then(res => {
        expect(res.body).toHaveLength(8);
      });
  });

  it('gets all grades for a course grouped by assignment', async() => {
    await seedGradesForAgg();
    await seedGradesForAgg();
    const course = await Course.findOne();
    return request(app)
      .get(`/api/v1/grades/assignments/${course._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          assignments: expect.any(Array)
        });
        expect(res.body.assignments[0]).toEqual({
          _id: expect.any(String),
          grades: expect.any(Array),
          course: expect.any(Array),
        });
      });
  });

  it('gets total grade for student', async() => {
    const ass = await Assignment.findOne();
    const user = await User.create({
      auth0id: chance.word(),
      firstName: 'first',
      lastName: 'last',
      email: chance.email(),
      role: 'student'
    });
    const sub = await Submission.create({
      assignment: ass._id,
      student: user._id,
      submission: 'heres my thing'
    });
    // eslint-disable-next-line no-unused-vars
    const grade = await Grade.create({
      submission: sub._id,
      grade: 98,
      grader: new mongoose.Types.ObjectId
    });
    // eslint-disable-next-line no-unused-vars
    const sub1 = await Submission.create({
      assignment: ass._id,
      student: user._id,
      submission: 'heres my thing'
    });
    // eslint-disable-next-line no-unused-vars
    const grade1 = await Grade.create({
      submission: sub._id,
      grade: 42,
      grader: new mongoose.Types.ObjectId
    });
    return request(app)
      .get(`/api/v1/grades/student/${user._id}`)
      .then(res => {
        expect(res.body).toEqual({
          grade: expect.any(Number)
        });
      });
  });

  it('gets all of a student\'s grades', async() => {
    const student = await User.findOne({ role: 'student' });
    return request(app)
      .get(`/api/v1/grades/student/recent/${student._id}`)
      .then(res => {
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          submission: {
            _id: expect.any(String),
            graded: expect.any(Boolean),
            assignment: expect.any(String),
            student: expect.any(String),
            submission:expect.any(String),
            updatedAt: expect.any(String),
            createdAt: expect.any(String),
          },
          grade: expect.any(Number),
          grader: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
          student: expect.any(Object),
          assignment: expect.any(Object),
        });
        expect(res.body[0].submission.student).toEqual(student._id.toString());
      });
  });

  it('gets 20 most recent grades for a course', async() => {
    const course = await Course.findOne();
    return request(app)
      .get(`/api/v1/grades/recent/${course._id}`)
      .then(res => {
        expect(res.body).toHaveLength(20);
        expect(res.body[0]).toEqual({ 
          _id: expect.any(String),
          submission: expect.any(Object),
          grade: expect.any(Number),
          grader: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String),
          assignment: expect.any(Object),
          course: expect.any(Object)
        });
        res.body.forEach(grade => {
          expect(grade.course._id).toEqual(course._id.toString());
        });
      });
  });

});
