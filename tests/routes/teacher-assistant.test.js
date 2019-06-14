const request = require('supertest');
const app = require('../../lib/app');
require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const { seedTAs } = require('../utils/seed-data');

jest.mock('../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(() => seedTAs());

afterAll(() => mongoose.connection.close());

describe('teacher assistant route tests', () => {

  it('signs up a new ta', () => {
    return request(app)
      .post('/api/v1/ta/')
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
          '_id': expect.any(String)
        });
      });
  })


});
