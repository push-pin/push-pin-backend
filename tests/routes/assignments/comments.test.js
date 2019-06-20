require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { seedComments } = require('../../utils/seed-data');
const Submission = require('../../../lib/models/assignments/Submission');
const User = require('../../../lib/models/profiles/User');
const { seed } = require('../../utils/seedCommentsForRecent');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => {
  return await Promise.all([seedComments()]);
});

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

  it('gets comments by submission id', async() => {
    const submission = await Submission.findOne();
    
    return request(app)
      .get(`/api/v1/comments/${submission._id}`)
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          submission: expect.any(String),
          comment: expect.any(String),
          commenter: expect.any(String),
          updatedAt: expect.any(String),
          createdAt: expect.any(String)
        });
      });
  });
    
  it('gets 20 most recent comments on a student\'s submission', async() => {
    await seed();
    const student = await User.findOne({ role: 'student', auth0id: '12345abc' });
    const teacher = await User.findOne({ role: 'teacher', auth0id: 'hot_teacher' });
    
    return request(app)
      .get(`/api/v1/comments/recent/${student._id}`)
      .then(res => {
        expect(res.body).toHaveLength(20);
        res.body.forEach(comment => {
          expect(comment.commenter).toEqual(teacher._id.toString());
        });
      });
  });

});


