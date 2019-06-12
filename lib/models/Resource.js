const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema ({
  course: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Course'
  },
  type: {
    type: String,
    require: true,
    enum: ['video', 'link', 'image']
  },
  description: {
    type: String,
    required: true
  },
  info: {
    // {
    //   link: '.com',
    //   image: '.jpg',
    //   video: '.vid'
    // }
    type: Object,
    required: true
  }
}, {
  versionKey: false
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
