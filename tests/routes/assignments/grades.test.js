require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { seedGrades } = require('../../utils/seed-data');
const Grade = require('../../../lib/models/assignments/Grade');
const Submission = require('../../../lib/models/assignments/Submission');

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
          grade: 98
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
          grade: expect.any(Number)
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
        console.log(res.body);
        expect(res.body).toEqual({
          _id: expect.any(String),
          submission: expect.any(String),
          grader: expect.any(String),
          grade: 50
        });
      });
  });

});
