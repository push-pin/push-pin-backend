const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema ({
  course: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Course'
  },
  year: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    require: true
  },
  endDate: {
    type: Date,
    require: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  versionKey: false
});

const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;
