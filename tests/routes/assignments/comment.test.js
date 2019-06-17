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

describe('comment route tests', () => {

  it('creates new comment', () => {
    return request(app)
      .post('/api/v1/comments')
      .send({
        submission: '5d07daa819015fc89b61d1c8',
        comment: 'commment comment',
        commenter: '5d07d90e12c04fc829e40fbe'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          submission: '5d07daa819015fc89b61d1c8',
          comment: 'commment comment',
          commenter: '5d07d90e12c04fc829e40fbe',
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        });
      });
  });
});
