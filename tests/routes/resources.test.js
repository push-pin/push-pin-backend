require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const { 
  seedResources
} = require('../utils/seed-data');

jest.mock('../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => {
  return await Promise.all([seedResources()]);
});

afterAll(() => mongoose.connection.close());

describe('resource route tests', () => {

  it('adds a resource', () => {
    return request(app)
      .post('/api/v1/resources/')
      .send({
        course: new mongoose.Types.ObjectId,
        user: new mongoose.Types.ObjectId,
        type: 'video',
        description: 'this explaints it really well!',
        info: {
          author: 'Roald Dahl'
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          course: expect.any(String),
          user: expect.any(String),
          _id: expect.any(String),
          active: true,
          type: 'video',
          description: 'this explaints it really well!',
          info: {
            author: 'Roald Dahl'
          }
        });
      });
  });

});
