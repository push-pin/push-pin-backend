const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema ({
  course: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Course'
  },
  type: {
    type: String,
    required: true,
    enum: ['video', 'link', 'image']
  },
  description: {
    type: String,
    required: true
  },
  info: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  versionKey: false
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
