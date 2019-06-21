require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { seedTeachers } = require('../../utils/seed-data');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => {
  return await Promise.all([seedTeachers(4)]);
});

afterAll(() => mongoose.connection.close());

describe('teachers route tests', () => {

  it('sign up a new teacher', () => {
    return request(app)
      .post('/api/v1/teachers')
      .send({
        'firstName': 'Bonnie',
        'lastName': 'McNeil',
        'email': 'bonnie873584@gmail.com',
        'currentCourse': new mongoose.Types.ObjectId
      })
      .then(res => {
        expect(res.body).toEqual({
          'firstName': 'Bonnie',
          'lastName': 'McNeil',
          'email': 'bonnie873584@gmail.com', 
          'user': expect.any(String),
          'courses': [expect.any(String)],
          '_id': expect.any(String)
        });
      }); 
  });

  it.only('gets all teachers', () => {
    return request(app)
      .get('/api/v1/teachers')
      .then(res => {
        expect(res.body).toHaveLength(4);
      });
  });
});
