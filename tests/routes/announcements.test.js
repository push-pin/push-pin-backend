require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const { seedAnnouncements } = require('../utils/seed-data');
const Course = require('../../lib/models/Course');

jest.mock('../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => await Promise.all([seedAnnouncements()]));

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

  it('gets 20 most recent active announcements', async() => {
    const course = await Course.findOne();
    return request(app)
      .get(`/api/v1/announcements/${course._id}`)
      .then(res => {
        expect(res.body).toHaveLength(20);
        expect(res.body[0]).toEqual({
          user: expect.any(Object),
          _id: expect.any(String),
          course: expect.any(String),
          active: true,
          title: expect.any(String),
          body: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        })
      });
  });

});
