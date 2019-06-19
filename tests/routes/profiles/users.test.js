require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const User = require('../../../lib/models/profiles/User');
const { 
  seedStudents,
  seedTAs, 
  seedTeachers
} = require('../../utils/seed-data');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
// beforeEach(async() => {
//   return await Promise.all([seedTAs()]);
// });

afterAll(() => mongoose.connection.close());

describe('user route tests', () => {

  it('gets a user who is a ta by auth0id', async() => {
    await seedTAs();
    const user = await User.findOne();
    return request(app)
      .get(`/api/v1/user/auth/${user.auth0id}`)
      .then(res => {
        expect(res.body).toEqual({
          user: {
            auth0id: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            role: 'ta',
            _id: expect.any(String),
            image: '../..//assets/placeholder.png',
          },
          profile: expect.any(Object),
          currentCourses: expect.any(Object)
        });
      });
  });

  it('gets a user who is a student by auth0id', async() => {
    await seedStudents();
    const user = await User.findOne();
    return request(app)
      .get(`/api/v1/user/auth/${user.auth0id}`)
      .then(res => {
        expect(res.body).toEqual({
          user: {
            auth0id: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            role: 'student',
            _id: expect.any(String),
            image: '../..//assets/placeholder.png',
          },
          profile: expect.any(Object),
          currentCourses: expect.any(Object)
        });
      });
  });

  it('gets a user who is a teacher by auth0id', async() => {
    await seedTeachers();
    const user = await User.findOne();
    return request(app)
      .get(`/api/v1/user/auth/${user.auth0id}`)
      .then(res => {
        expect(res.body).toEqual({
          user: {
            auth0id: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            role: 'teacher',
            _id: expect.any(String),
            image: '../..//assets/placeholder.png',
          },
          profile: expect.any(Object),
          currentCourses: expect.any(Array)
        });
      });
  });

});
