const { Router } = require('express');
const Comment = require('../../models/assignments/Comment');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { submission, comment, commenter } = req.body;
    Comment
      .create({ submission, comment, commenter })
      .then(ass => res.send(ass))
      .catch(next);
  })
  .get('/:submissionId', (req, res, next) => {
    const { submissionId } = req.params;

    Comment
      .find({ submission: submissionId })
      .then(res => {
        return res;
      })
      // .lean()
      .then(allComents => res.send(allComents))
      .catch(next);
  });
