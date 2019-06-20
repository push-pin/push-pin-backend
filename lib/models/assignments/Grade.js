const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

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
    }, {
      '$lookup': {
        'from': 'assignments', 
        'localField': '_id', 
        'foreignField': '_id', 
        'as': 'assignment'
      }
    }, {
      '$unwind': {
        'path': '$assignment'
      }
    }, {
      '$project': {
        '_id': true, 
        'title': '$assignment.title', 
        'grades': true
      }
    }
  ]);
};

gradeSchema.statics.assignmentsByCourse = function(courseId) {
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
      '$addFields': {
        'course': '$assignment.course'
      }
    }, {
      '$group': {
        '_id': '$assignment._id', 
        'grades': {
          '$push': '$$ROOT'
        }, 
        'course': {
          '$push': '$course'
        }
      }
    }, {
      '$group': {
        '_id': {
          '$arrayElemAt': [
            '$course', 0
          ]
        }, 
        'assignments': {
          '$push': '$$ROOT'
        }
      }
    }, {
      '$match': {
        '_id': new mongoose.Types.ObjectId(courseId)
      }
    }
  ]);
};

gradeSchema.statics.studentTotalGrade = async function(studentId) {
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

gradeSchema.statics.studentGrades = function(studentId) {
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
      '$match': {
        'submission.student': new mongoose.Types.ObjectId(studentId)
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
      '$sort': {
        'updatedAt': -1
      }
    }
  ]);
};

gradeSchema.statics.recentGrades = function(courseId) {
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
      '$lookup': {
        'from': 'courses', 
        'localField': 'assignment.course', 
        'foreignField': '_id', 
        'as': 'course'
      }
    }, {
      '$unwind': {
        'path': '$course'
      }
    }, {
      '$sort': {
        'updatedAt': -1
      }
    }, {
      '$match': {
        'course._id': new mongoose.Types.ObjectId(courseId)
      }
    }, {
      '$limit': 20
    }
  ]);
}

gradeSchema.plugin(timestamp);
const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
