const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema ({
  course: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
    require: true
  },
  type: {
    type: String,
    required: true,
    enum: ['reading', 'solo', 'mob', 'project']
  },
  title: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  classDate: {
    type: Date,
    required: true
  },
  dateAvailable: {
    type: Date,
    required: true
  },
  dateDue: {
    type: Date,
    required: true
  },
  dateClosed: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  pointsPossible: {
    type: Number,
    required: true
  }
}, {
  versionKey: false
});

assignmentSchema.statics.weekAtAGlance = function(thisMonday, endDate, course) {
  return this.aggregate([
    {
      '$match': {
        'dateDue': {
          '$gte': new Date(thisMonday), 
          '$lt': new Date(endDate)
        }
      }
    }, 
    {
      '$match': {
        'course': new mongoose.Types.ObjectId(course)
      }
    }
  ]);
};

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
