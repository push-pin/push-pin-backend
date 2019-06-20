const { Router } = require('express');
const Comment = require('../../models/assignments/Comment');
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
  .get('/:submissionId', checkAuth(STUDENT, TA, TEACHER), (req, res, next) => {
    const { submissionId } = req.params;

    Comment
      .find({ submission: submissionId })
      // .then(res => {
      //   if(req.pushPinUser && req.pushPinUser.role === STUDENT && req.pushPinUser._id !== res.student) {
      //     return next('Not Authorized');
      //   }
      // })
      // .lean()
      .then(allComents => res.send(allComents))
      .catch(next);
  });
