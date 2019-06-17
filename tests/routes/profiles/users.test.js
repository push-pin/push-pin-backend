require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const User = require('../../../lib/models/profiles/User');
// const { 
//   seedStudents
// } = require('../../utils/seed-data');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
// beforeEach(async() => {
//   return await Promise.all([seedStudents()]);
// });

afterAll(() => mongoose.connection.close());

describe('user route tests', () => {

  it('gets a user by auth0id', async() => {
    const user = await User.create({
      auth0id: '12345beep',
      firstName: 'Ryan',
      lastName: 'Gosling',
      email: 'ryan@gosling.com',
      role: 'teacher'
    });
    return request(app)
      .get(`/api/v1/user/auth/${user.auth0id}`)
      .then(res => {
        expect(res.body).toEqual({
          auth0id: '12345beep',
          firstName: 'Ryan',
          lastName: 'Gosling',
          email: 'ryan@gosling.com',
          role: 'teacher',
          _id: expect.any(String),
          image: '../..//assets/placeholder.png'
        });
      });

  });

});
