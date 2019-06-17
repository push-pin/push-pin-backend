require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const Assignment = require('../../../lib/models/assignments/Assignment');
const User = require('../../../lib/models/profiles/User');
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

  
});


