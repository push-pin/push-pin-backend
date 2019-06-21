require('dotenv').config();
const request = require('supertest');
const app = require('../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const { 
  seedCourses
} = require('../utils/seed-data');
const Course = require('../../lib/models/Course');

jest.mock('../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => {
  return await Promise.all([seedCourses()]);
});

afterAll(() => mongoose.connection.close());

describe('ourses route tests', () => {

  it('adds a course', () => {
    return request(app)
      .post('/api/v1/courses')
      .send({
        name: 'Intro to Javascript',
        term: 'Spring 2019',
        startDate: new Date(),
        endDate: new Date(),
        courseType: 'BootCamp1'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Intro to Javascript',
          term: 'Spring 2019',
          startDate: expect.any(String),
          endDate: expect.any(String),
          courseType: 'BootCamp1',
          _id: expect.any(String),
          active: true
        });
      });
  });

  it('gets a list of active courses', () => {
    return request(app)
      .get('/api/v1/courses')
      .then(res => {
        expect(res.body).toHaveLength(4);
      });
  });

  it('gets a list of inactive courses', async() => {
    await Course.create({
      name: 'Intro to Javascript',
      term: 'Spring 2019',
      startDate: new Date(),
      endDate: new Date(),
      courseType: 'BootCamp1',
      active: false
    });
    return request(app)
      .get('/api/v1/courses/inactive')
      .then(res => {
        expect(res.body).toHaveLength(1);
      });
  });

  it('gets a course by id', async() => {
    const newCourse = await Course.create({
      name: 'Intro to Javascript',
      term: 'Spring 2019',
      startDate: new Date(),
      endDate: new Date(),
      courseType: 'BootCamp1'
    });

    return request(app)
      .get(`/api/v1/courses/${newCourse._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'Intro to Javascript',
          term: 'Spring 2019',
          startDate: expect.any(String),
          endDate: expect.any(String),
          courseType: 'BootCamp1',
          _id: expect.any(String),
          active: true
        });
      });
  });

  it('updates an existing course', async() => {
    const newCourse = await Course.create({
      name: 'Intro to Javascript',
      term: 'Spring 2019',
      startDate: new Date(),
      endDate: new Date(),
      courseType: 'BootCamp1'
    });

    return request(app)
      .patch(`/api/v1/courses/${newCourse._id}`)
      .send({
        name: 'Javascript Stick And Poke Tutorial',
        courseType: 'CareerTrack'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'Javascript Stick And Poke Tutorial',
          term: 'Spring 2019',
          startDate: expect.any(String),
          endDate: expect.any(String),
          courseType: 'CareerTrack',
          _id: expect.any(String),
          active: true
        });
      });
  });

  it('deletes a course by setting active: false', async() => {
    const newCourse = await Course.create({
      name: 'Intro to Javascript',
      term: 'Spring 2019',
      startDate: new Date(),
      endDate: new Date(),
      courseType: 'BootCamp1'
    });

    return request(app)
      .delete(`/api/v1/courses/${newCourse._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'Intro to Javascript',
          term: 'Spring 2019',
          startDate: expect.any(String),
          endDate: expect.any(String),
          courseType: 'BootCamp1',
          _id: expect.any(String),
          active: false
        });
      });
  });
});
