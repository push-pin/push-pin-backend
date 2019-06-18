const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema ({
  submission: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Submission',
    unique: true
  },
  grade: {
    type: Number,
    required: true
  },
  grader: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  versionKey: false
});

gradeSchema.statics.byAssignments = function() {
  return this.aggregate([
    {
      '$lookup': {
        'from': 'submissions', 
        'localField': 'submission', 
        'foreignField': '_id', 
        'as': 'submission'
      }
    }, {
      '$unwind': {
        'path': '$submission'
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'submission.student', 
        'foreignField': '_id', 
        'as': 'student'
      }
    }, {
      '$unwind': {
        'path': '$student'
      }
    }, {
      '$lookup': {
        'from': 'assignments', 
        'localField': 'submission.assignment', 
        'foreignField': '_id', 
        'as': 'assignment'
      }
    }, {
      '$unwind': {
        'path': '$assignment'
      }
    }, {
      '$group': {
        '_id': '$assignment._id', 
        'grades': {
          '$push': '$$ROOT'
        }
      }
    }
  ]);
};

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
