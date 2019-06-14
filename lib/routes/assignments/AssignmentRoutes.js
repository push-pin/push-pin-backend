const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Assignment = require('../../models/assignments/Assignment');

module.exports = Router()
  .post('/', checkAuth('TEACHER', 'TA'), (req, res, next) => {
    const { courseId, type, instructions, dateAvailable, dateDue, dateClosed } = req.body;
    Assignment
      .create({ courseId, type, instructions, dateAvailable, dateDue, dateClosed })
      .then(ass => res.send(ass))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Assignment
      .find({ active: true })
      .lean()
      .then(allAsses => res.send(allAsses))
      .catch(next);
  })
  .get('/inactive', (req, res, next) => {
    Assignment
      .find({ active: false })
      .lean()
      .then(allAsses => res.send(allAsses))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Assignment
      .findById(req.params.id)
      .lean()
      .then(ass => res.send(ass))
      .catch(next);
  })
  .patch('/:id', checkAuth('TEACHER', 'TA'), (req, res, next) => {
    // make old inactive
    Assignment
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .lean()
      .then(updatedAss => res.send(updatedAss))
      .catch(next);
  })
  .delete('/:id', checkAuth('TEACHER', 'TA'), (req, res, next) => {
    // make old inactive    
    Assignment
      .findByIdAndDelete(req.params.id)
      .lean()
      .then(deletedAss => res.send(deletedAss))
      .catch(next);
  });
