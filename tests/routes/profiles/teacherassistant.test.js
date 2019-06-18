require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { seedTAs } = require('../../utils/seed-data');
const TeacherAssistant = require('../../../lib/models/profiles/TeacherAssistant');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => {
  return await Promise.all([seedTAs(4)]);
});

afterAll(() => mongoose.connection.close());

describe('tas route tests', () => {

  it('sign up a new ta', () => {
    return request(app)
      .post('/api/v1/tas')
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

  it('gets a list of teaching assistants', () => {
    return request(app)
      .get('/api/v1/tas')
      .then(res => {
        expect(res.body).toHaveLength(4);
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          user: expect.any(Object),
          pastCourses: [expect.any(Object), expect.any(Object)],
          currentCourse: expect.any(Object)
        }); 
      });
  });

  it.only('updates a teaching assistant\'s current course', async() => {
    const newTA = await TeacherAssistant.findOne();
    return request(app)
      .patch(`/api/v1/tas/${newTA._id}`)
      .send({
        newCourse: new mongoose.Types.ObjectId
      })
      .then(res => {
        expect(res.body).toEqual({
          'user': expect.any(String),
          'currentCourse': expect.any(String),
          'pastCourses': expect.any(Array),
          '_id': expect.any(String)
        });
      });
     
  });


});
