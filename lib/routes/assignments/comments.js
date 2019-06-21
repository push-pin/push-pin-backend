const { Router } = require('express');
const Comment = require('../../models/assignments/Comment');
const Submission = require('../../models/assignments/Submission');
const { checkAuth } = require('../../middleware/ensure-auth');
const { STUDENT, TA, TEACHER } = require('../../models/userRoles');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { submission, comment, commenter } = req.body;
    Comment
      .create({ submission, comment, commenter })
      .then(ass => res.send(ass))
      .catch(next);
  })

  .get('/recent/:studentId', checkAuth(TA, TEACHER, STUDENT), (req, res, next) => {
    const { studentId } = req.params;
    if(req.pushPinUser.role === STUDENT && req.pushPinUser._id.toString() !== studentId) {
      return next('Not Authorized');
    }
    Submission
      .find({ student: studentId })
      .then(submissions => {
        Comment
          .find({ submission: submissions })
          .lean()
          .populate({ path: 'submission',
            populate: { path: 'assignment' } })
          .populate('commenter', {
            firstName: true,
            lastName: true,
            _id: true,
            role: true
          })
          .sort({ updatedAt: -1 })
          .then(comments => {
            const filteredComments = comments.filter(comment => comment.commenter._id.toString() !== studentId);
            res.send(filteredComments.slice(-20));
          });
      })
      .catch(next);
  })

  .get('/:submissionId', checkAuth(STUDENT, TA, TEACHER), (req, res, next) => {
    const { submissionId } = req.params;
    console.log('hi');
    Comment
      .find({ submission: submissionId })
      .lean()
      .populate('commenter', {
        firstName: true,
        lastName: true,
        _id: true,
        role: true
      })
      .then(res => {
        if(req.pushPinUser.role === STUDENT && req.pushPinUser._id.toString() !== res.student) {
          return next('Not Authorized');
        }
        return res;
      })
      .then(allComents => res.send(allComents))
      .catch(next);
  });
