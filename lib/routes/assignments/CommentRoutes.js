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
    const { submissionId } = req.params.submissionId;
    Comment
      .find({ submission: submissionId, active: true })
      .lean()
      .then(allAsses => res.send(allAsses))
      .catch(next);
  })
  .get('/:submissionId/inactive', (req, res, next) => {
    const { submissionId } = req.params.submissionId;
    Comment
      .find({ submission: submissionId, active: false })
      .lean()
      .then(allAsses => res.send(allAsses))
      .catch(next);
  });
