require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');

jest.mock('../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());

afterAll(() => mongoose.connection.close());

describe('announcement route tests', () => {

  it('create a new announcement', () => {
    return request(app)
      .post('/api/v1/announcements')
      .send({
        user: new mongoose.Types.ObjectId,
        course: new mongoose.Types.ObjectId,
        title: 'PushPin wins best new app',
        body: 'Team Taco Butts sold PushPin for $100 million'
      })
      .then(res => {
        expect(res.body).toEqual({
          user: expect.any(String),
          _id: expect.any(String),
          course: expect.any(String),
          active: true,
          title: 'PushPin wins best new app',
          body: 'Team Taco Butts sold PushPin for $100 million',
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        });
      });
  });

});
