const request = require('supertest');
const app = require('../../lib/app');
require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const { seedStudents } = require('../utils/seed-data');

jest.mock('../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(() => seedStudents());

afterAll(() => mongoose.connection.close());

describe('student route tests', () => {

  it('allows a teacher to sign up a new student', () => {
    return request(app)
      .post('/api/v1/students/')
      .send({
        'auth0id': '1234567890',
        'firstName': 'Bonnie',
        'lastName': 'McNeil',
        'email': 'bonnie1@gmail.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          'firstName': 'Bonnie',
          'lastName': 'McNeil',
          'email': 'bonnie1@gmail.com',
          'user': expect.any(String),
          'pastCourses': [],
          'attendance': 0,
          '_id': expect.any(String)
        });
      });
  });

  it('gets all students', () => {
    return request(app)
      .get('/api/v1/students')
      .then(res => {
        console.log(res.body[0]);
        expect(res.body).toHaveLength(10);
      });
  });

});
