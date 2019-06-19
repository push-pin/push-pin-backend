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

gradeSchema.statics.studentTotalGrade = async function(studentId) {
  console.log('studentid agg', studentId);
  const allSubs = await this.aggregate([
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
    }
  ]);

  if(allSubs.length === 0) return { grade: 0 };
  let totalPossiblePoints = 0;
  let totalEarnedPoints = 0;
  allSubs.forEach(sub => {
    totalPossiblePoints += sub.assignment.pointsPossible;
    totalEarnedPoints += sub.grade;
  });
  return { grade: totalEarnedPoints / totalPossiblePoints };
};

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
