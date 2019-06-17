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

describe('ass route tests', () => {

  it('create new ass', () => {
    return request(app)
      .post('/api/v1/assignments')
      .send({
        courseId: '5d07c19a8e6534c26197f62a',
        type: 'reading',
        title: 'this new reading',
        instructions: 'read the thing',
        dateAvailable: 'Mon Jun 17 2019 10:48:30 GMT-0700 (Pacific Daylight Time)',
        dateDue: 'Mon Jun 17 2019 10:48:30 GMT-0700 (Pacific Daylight Time)',
        dateClosed: 'Mon Jun 17 2019 10:48:30 GMT-0700 (Pacific Daylight Time)'
      })
      .then(res => {
        expect(res.body).toEqual({
          active: true,
          _id: expect.any(String),
          courseId: '5d07c19a8e6534c26197f62a',
          type: 'reading',
          title: 'this new reading',
          instructions: 'read the thing',
          dateAvailable: '2019-06-17T17:48:30.000Z',
          dateDue: '2019-06-17T17:48:30.000Z',
          dateClosed: '2019-06-17T17:48:30.000Z'
        });
      });
  });
});
