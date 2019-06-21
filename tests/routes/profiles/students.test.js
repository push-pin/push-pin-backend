require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { 
  seedStudents
} = require('../../utils/seed-data');
const Student = require('../../../lib/models/profiles/Student');

jest.mock('../../../lib/middleware/ensure-auth.js');

beforeAll(() => connect());

beforeEach(() => mongoose.connection.dropDatabase());
beforeEach(async() => seedStudents());

afterAll(() => mongoose.connection.close());

describe('student route tests', () => {
 
  it('gets all students', () => {
    return request(app)
      .get('/api/v1/students')
      .then(res => {
        expect(res.body).toHaveLength(10);
      });
  });
 
  it('gets a student by user id', async() => {
    const student = await Student.findOne();

    return request(app)
      .get(`/api/v1/students/${student.user}`)
      .then(res => {
        expect(res.body).toEqual({
          student: { 
            _id: expect.any(String), 
            attendance: 0, 
            currentCourse: expect.any(String), 
            grader: expect.any(String), 
            pastCourses: expect.any(Array), 
            user: expect.any(String) 
          }, 
          user: {
            _id: expect.any(String), 
            auth0id: expect.any(String), 
            email: expect.any(String), 
            firstName: expect.any(String), 
            image: '../..//assets/placeholder.png', 
            lastName: expect.any(String), 
            role: 'student' } });
      });
  });
});
