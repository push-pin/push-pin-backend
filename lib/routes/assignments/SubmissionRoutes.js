const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Submission = require('../../models/assignments/Submission');

module.exports = Router()
  .post('/', checkAuth('STUDENT'), (req, res, next) => {
    const { assignment, student, submission } = req.body;
    Submission
      .create({ assignment, student, submission })
      .then(ass => res.send(ass))
      .catch(next);
  })
  .get('/:studentId', (req, res, next) => {
    const { studentId } = req.params.studentId;
    Submission
      .find({ student: studentId, active: true })
      .lean()
      .then(allAsses => res.send(allAsses))
      .catch(next);
  })
  .get('/:studentId/inactive', (req, res, next) => {
    const { studentId } = req.params.studentId;
    Submission
      .find({ student: studentId, active: false })
      .lean()
      .then(allAsses => res.send(allAsses))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Submission
      .findById(req.params.id)
      .lean()
      .then(ass => res.send(ass))
      .catch(next);
  }) 
  .patch('/:id', checkAuth('STUDENT'), (req, res, next) => {
    Submission
      .findByIdAndUpdate(req.params.id, { ...req.body, graded: false }, { new: true })
      .lean()
      .then(updatedAss => res.send(updatedAss))
      .catch(next);
  });
