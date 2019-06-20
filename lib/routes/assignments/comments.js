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

  .get('/recent/:studentId', (req, res, next) => {
    const { studentId } = req.params;
    Submission
      .find({ student: studentId })
      .then(submissions => {
        Comment
          .find({ submission: submissions })
          .lean()
          .sort({ updatedAt: -1 })
          .then(comments => {
            const filteredComments = comments.filter(comment => comment.commenter.toString() !== studentId);
            res.send(filteredComments.slice(-20));
          });
      })
      .catch(next);
  })

  .get('/:submissionId', checkAuth(STUDENT, TA, TEACHER), (req, res, next) => {
    const { submissionId } = req.params;
    Comment
      .find({ submission: submissionId })
      .lean()
      .then(res => {
        if(req.pushPinUser.role === STUDENT && req.pushPinUser._id !== res.student) {
          return next('Not Authorized');
        }
        return res;
      })
      .then(allComents => res.send(allComents))
      .catch(next);
  });
