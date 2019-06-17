require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { seedAsses } = require('../../utils/seed-data');
const Assignments = require('../../../lib/models/assignments/Assignment');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => {
  return await Promise.all([seedAsses()]);
});

afterAll(() => mongoose.connection.close());

describe('assignment route tests', () => {

  it('create a new assignment', () => {
    return request(app)
      .post('/api/v1/assignments/')
      .send({
        course: new mongoose.Types.ObjectId,
        type: 'reading',
        title: 'Read this thing',
        instructions: 'Read pages 1-10 and answer the questions',
        dateAvailable: new Date(),
        dateDue: new Date(),
        dateClosed: new Date()
      })
      .then(res => {
        expect(res.body).toEqual({
          course: expect.any(String),
          _id: expect.any(String),
          type: 'reading',
          title: 'Read this thing',
          instructions: 'Read pages 1-10 and answer the questions',
          dateAvailable: expect.any(String),
          dateDue: expect.any(String),
          dateClosed: expect.any(String),
          active: true
        });
      });
  });

});
