require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { seedTAs } = require('../../utils/seed-data');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(() => seedTAs());

afterAll(() => mongoose.connection.close());

describe('admin route tests', () => {

  it('signs up a new ta', () => {
    return request(app)
      .post('/api/v1/admin/ta')
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
  });

  it('sign up a new teacher', () => {
    return request(app)
      .post('/api/v1/admin/teacher')
      .send({
        'auth0id': '1234567890',
        'firstName': 'Bonnie',
        'lastName': 'McNeil',
        'email': 'bonnie3@gmail.com',
        'currentCourse': new mongoose.Types.ObjectId
      })
      .then(res => {
        expect(res.body).toEqual({
          'firstName': 'Bonnie',
          'lastName': 'McNeil',
          'email': 'bonnie3@gmail.com',
          'user': expect.any(String),
          'courses': [expect.any(String)],
          '_id': expect.any(String)
        });
      });
  });

  it('gets a list of teaching assistants', () => {
    return request(app)
      .get('/api/v1/admin/ta')
      .then(res => {
        expect(res.body).toHaveLength(10);
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          user: expect.any(Object),
          pastCourses: [expect.any(Object), expect.any(Object)],
          currentCourse: expect.any(Object)
        }); 
      });
  });

  it('updates a teaching assistant\'s current course', () => {
    return request(app)
      .post('/api/v1/admin/ta')
      .send({
        'auth0id': '1234567890',
        'firstName': 'Bonnie',
        'lastName': 'McNeil',
        'email': 'bonnie10@gmail.com',
        'currentCourse': new mongoose.Types.ObjectId
      })
      .then(res => res.body)
      .then(newTA => {
        return request(app)
          .patch(`/api/v1/admin/ta/${newTA._id}`)
          .send({
            newCourse: new mongoose.Types.ObjectId
          })
          .then(res => {
            expect(res.body).toEqual({
              'user': expect.any(String),
              'currentCourse': expect.any(String),
              'pastCourses': [newTA.currentCourse],
              '_id': expect.any(String)
            });
          });
      });
  });


});