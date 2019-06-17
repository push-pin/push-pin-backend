require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { seedAsses } = require('../../utils/seed-data');
const Assignment = require('../../../lib/models/assignments/Assignment');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(() => seedAsses());

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

  it('gets ass by id', async() => {
    const ass = await Assignment.findOne();
    return request(app)
      .post(`/api/v1/assignments/${ass._id}`)
      .then(res => {
        expect(res.body).toEqual({
          active: true,
          _id: expect.any(String),
          courseId: expect.any(String),
          type: expect.any(String),
          title: expect.any(String),
          instructions: expect.any(String),
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String)
        });
      });
  });
});
