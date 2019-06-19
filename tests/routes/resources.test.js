require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const { 
  seedResources
} = require('../utils/seed-data');
const Resource = require('../../lib/models/Resource');
const Course = require('../../lib/models/Course');

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
        description: 'this explains it really well!',
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
          description: 'this explains it really well!',
          info: {
            author: 'Roald Dahl'
          }
        });
      });
  });

  it('gets all active resources', () => {
    return request(app)
      .get('/api/v1/resources')
      .then(res => {
        expect(res.body).toHaveLength(10);
      });
  });

  it('gets inactive/archived resources', async() => {
    await Resource.create({
      course: new mongoose.Types.ObjectId,
      user: new mongoose.Types.ObjectId,
      type: 'video',
      description: 'this explains it really well!',
      info: {
        author: 'Roald Dahl'
      },
      active: false 
    });
    await Resource.create({
      course: new mongoose.Types.ObjectId,
      user: new mongoose.Types.ObjectId,
      type: 'link',
      description: 'this explains it really poorly!',
      info: {
        author: 'Ryan Gosling'
      },
      active: false
    });
    return request(app)
      .get('/api/v1/resources/inactive')
      .then(res => {
        expect(res.body).toHaveLength(2);
      });
  });

  it('gets a resource by id', async() => {
    const res1 = await Resource.create({
      course: new mongoose.Types.ObjectId,
      user: new mongoose.Types.ObjectId,
      type: 'video',
      description: 'this explains it really well!',
      info: {
        author: 'Roald Dahl'
      }
    });
    return request(app)
      .get(`/api/v1/resources/${res1._id}`)
      .then(res => {
        expect(res.body).toEqual({
          course: expect.any(String),
          user: expect.any(String),
          _id: expect.any(String),
          active: true,
          type: 'video',
          description: 'this explains it really well!',
          info: {
            author: 'Roald Dahl'
          }
        });
      });
  });

  it('gets a resources by course id', async() => {
    const course = await Course.create({
      name: 'course 1',
      term: 'this term',
      startDate: new Date(),
      endDate: new Date(),
      courseType: 'BootCamp1'
    });
    // eslint-disable-next-line no-unused-vars
    const res1 = await Resource.create({
      course: course._id,
      user: new mongoose.Types.ObjectId,
      type: 'video',
      description: 'this explains it really well!',
      info: {
        author: 'Roald Dahl'
      }
    });
  
    return request(app)
      .get(`/api/v1/resources/course/${course._id}`)
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        expect(res.body[0]).toEqual({
          course: expect.any(String),
          user: expect.any(String),
          _id: expect.any(String),
          active: expect.any(Boolean),
          type: 'video',
          description: 'this explains it really well!',
          info: {
            author: 'Roald Dahl'
          }
        });
      });
  });

  it('updates a resource by id', async() => {
    const res1 = await Resource.create({
      course: new mongoose.Types.ObjectId,
      user: new mongoose.Types.ObjectId,
      type: 'video',
      description: 'this explains it really well!',
      info: {
        author: 'Roald Dahl'
      }
    });
    return request(app)
      .patch(`/api/v1/resources/${res1._id}`)
      .send({
        description: 'Check this out'
      })
      .then(res => {
        expect(res.body).toEqual({
          course: expect.any(String),
          user: expect.any(String),
          _id: expect.any(String),
          active: true,
          type: 'video',
          description: 'Check this out',
          info: {
            author: 'Roald Dahl'
          }
        });
      });
  });

  it('deletes a resource by id (sets active: false)', async() => {
    const res1 = await Resource.create({
      course: new mongoose.Types.ObjectId,
      user: new mongoose.Types.ObjectId,
      type: 'video',
      description: 'this explains it really well!',
      info: {
        author: 'Roald Dahl'
      }
    });
    return request(app)
      .delete(`/api/v1/resources/${res1._id}`)
      .then(res => {
        expect(res.body).toEqual({
          course: expect.any(String),
          user: expect.any(String),
          _id: expect.any(String),
          active: false,
          type: 'video',
          description: 'this explains it really well!',
          info: {
            author: 'Roald Dahl'
          }
        });
      });
  });

});
