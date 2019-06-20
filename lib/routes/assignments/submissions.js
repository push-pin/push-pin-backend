const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Submission = require('../../models/assignments/Submission');
const Assignment = require('../../models/assignments/Assignment');
const Grade = require('../../models/assignments/Grade');
const { STUDENT, TA, TEACHER } = require('../../models/userRoles');

module.exports = Router()
  .post('/', checkAuth(STUDENT), (req, res, next) => {
    const { assignment, student, submission } = req.body;
    Submission
      .create({ assignment, student, submission })
      .then(ass => res.send(ass))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Submission
      .findById(req.params.id)
      .lean()
      .then(ass => res.send(ass))
      .catch(next);
  }) 

  .get('/recent/:courseId', checkAuth(TA, TEACHER), async(req, res, next) => {
    const asses = await Assignment
      .find({ course: req.params.courseId });
    Submission
      .find({ assignment: asses })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', {
        _id: true,
        firstName: true,
        lastName: true
      })
      .lean()
      .then(recentSubs => res.send(recentSubs))
      .catch(next);
  })

  .get('/student/:student', (req, res, next) => {
    const { student } = req.params;
    Submission
      .find({ student })
      .lean()
      .then(async(allSubs) => {
        const gradedSubs = await allSubs.map(async(submission) => {
          let subGrade = {};
          if(submission.graded) {
            subGrade = await Grade
              .findOne({ submission: submission._id });
          }
          const result = { submission, grade: subGrade };
          return result;
        });
        
        return Promise.all(gradedSubs);
      })
      .then(gradedSubs => res.send(gradedSubs))
      .catch(next);
  })

  .get('/assignment/:assignment', (req, res, next) => {
    const { assignment } = req.params;
    Submission
      .find({ assignment })
      .lean()
      .populate({ path: 'student', 
        populate: { path: 'user' }
      })
      .then(allAsses => res.send(allAsses))
      .catch(next);
  })

  .patch('/:id', checkAuth(STUDENT), (req, res, next) => {
    if(req.pushPinUser.role === STUDENT && req.pushPinUser._id !== req.params.id) return next('Not Authorized');
    Submission
      .findByIdAndUpdate(req.params.id, { ...req.body, graded: false }, { new: true })
      .lean()
      .then(updatedAss => res.send(updatedAss))
      .catch(next);
  });
