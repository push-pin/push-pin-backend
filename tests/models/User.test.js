const User = require('../../lib/models/profiles/User');
const mongoose = require('mongoose');

describe('User model', () => {

  it('new User', () => {
    const user = new User({
      auth0id: '12345678',
      role: 'teacher'
    });
    expect(user.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      auth0id: '12345678', 
      role: 'teacher'
    });
  });

});
