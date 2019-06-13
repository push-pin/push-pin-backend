require('dotenv').config();
const User = require('../../lib/models/profiles/User');
const Student = require('../../lib/models/profiles/Student');
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');

beforeAll(() => connect());

afterAll(() => mongoose.connection.close());

describe('User model', () => {

  it('new User', () => {
    const user = new User({
      auth0id: '12345678',
      role: 'teacher',
      firstName: 'Ryan',
      lastName: 'Gosling'
    });
    expect(user.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      auth0id: '12345678', 
      role: 'teacher',
      firstName: 'Ryan',
      lastName: 'Gosling'
    });
  });

  it('gets user profile', () => {
    const user = new User({
      auth0id: '12345678',
      role: 'student',
      firstName: 'Ryan',
      lastName: 'Gosling'
    });
    return Student.create({
      userId: user._id,
      currentClass: new mongoose.Types.ObjectId,
      pastClasses: [new mongoose.Types.ObjectId, new mongoose.Types.ObjectId]
    })
      .then(student => {
        return user.getProfile()
          .then(foundStudent => {
            expect(foundStudent).toEqual({
              ...student.toJSON(),
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              userId: user._id,
              auth0id: user.auth0id
            });
          });
      });
  });

});
