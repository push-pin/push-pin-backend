const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Comment = require('../../models/Comments/Comment');

module.exports = Router()
  .post('/', checkAuth('TEACHER', 'TA'), (req, res, next) => {
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
  })
  .get('/:id', (req, res, next) => {
    Comment
      .findById(req.params.id)
      .lean()
      .then(ass => res.send(ass))
      .catch(next);
  })
  .patch('/:id', checkAuth('TEACHER', 'TA'), (req, res, next) => {
    // make old inactive
    Comment
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .lean()
      .then(updatedAss => res.send(updatedAss))
      .catch(next);
  })
  .delete('/:id', checkAuth('TEACHER', 'TA'), (req, res, next) => {
    // make old inactive    
    Comment
      .findByIdAndDelete(req.params.id)
      .lean()
      .then(deletedAss => res.send(deletedAss))
      .catch(next);
  });
