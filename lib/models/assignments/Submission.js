const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const submissionSchema = new mongoose.Schema ({
  assignment: {
    type: mongoose.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submission: {
    type: String,
    required: true
  },
  graded: {
    type: Boolean,
    default: false
  }
}, {
  versionKey: false
});

submissionSchema.plugin(timestamp);

submissionSchema.statics.courseSubs = async function(student, course) {
  const subs = await this.aggregate([
    {
      '$match': {
        'student': new mongoose.Types.ObjectId(student)
      }
    }, 
    {
      '$lookup': {
        'from': 'assignments', 
        'localField': 'assignment', 
        'foreignField': '_id', 
        'as': 'assignment'
      }
    }, 
    {
      '$unwind': {
        'path': '$assignment'
      }
    }, 
    {
      '$match': {
        'assignment.course': new mongoose.Types.ObjectId(course)
      }
    }
  ]
  );
  return subs;
};



const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
