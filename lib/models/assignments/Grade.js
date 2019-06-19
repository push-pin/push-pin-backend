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

const Grade = mongoose.model('Grade', gradeSchema);

gradeSchema.statics.studentTotalGrade = function(studentId) {
  const allSubs = this.aggregate([
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
      '$match': {
        'submission.student': new mongoose.Types.ObjectId(studentId)
      }
    }, {}
  ]);
  console.log(allSubs);
  let totalPossiblePoints = 0;
  let totalEarnedPoints = 0;
  allSubs.forEach(sub => {
    totalPossiblePoints += sub.submission.grade;
    totalEarnedPoints += sub.assignment.pointsPossible;
  });
  return totalEarnedPoints / totalPossiblePoints;
};

module.exports = Grade;
