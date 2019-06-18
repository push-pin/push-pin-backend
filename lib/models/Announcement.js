const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const announcementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  course: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Course'
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  versionKey: false
});

announcementSchema.plugin(timestamp);
const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
