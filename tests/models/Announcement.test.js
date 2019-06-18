const mongoose = require('mongoose');
const Announcement = require('../../lib/models/Announcement');

describe('Announcement model test', () => {
  
  it('new Announcement', () => {
    const announcement = new Announcement({
      user: new mongoose.Types.ObjectId,
      course: new mongoose.Types.ObjectId,
      title: 'PushPin is amazing',
      body: 'Team Taco Butts is the smartest group Alchemy has ever had'
    });
    expect(announcement.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      user: expect.any(mongoose.Types.ObjectId),
      course: expect.any(mongoose.Types.ObjectId),
      active: true,
      title: 'PushPin is amazing',
      body: 'Team Taco Butts is the smartest group Alchemy has ever had'
    });
  });

});
