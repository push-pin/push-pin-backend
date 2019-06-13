const mongoose = require('mongoose');
const Resource = require('../../lib/models/Resource');

describe('Resource model', () => {
  it('new Resource', () => {
    const resource = new Resource({
      course: new mongoose.Types.ObjectId,
      type: 'video',
      description: 'this is a neat video',
      info: {
        // link: '',
        // image: '',
        video: 'video.vid'
      }
    });

    expect(resource.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      course: expect.any(mongoose.Types.ObjectId),
      type: 'video',
      description: 'this is a neat video',
      info: {
        // link: '',
        // image: '',
        video: 'video.vid'
      }
    });
  });
});
