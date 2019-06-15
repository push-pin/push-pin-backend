const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Assignment = require('../../models/assignments/Assignment');
const { STUDENT, TEACHER, TA } = require('../../models/userRoles');

module.exports = Router()
  .post('/', checkAuth(TEACHER, TA), (req, res, next) => {
    const { courseId, type, instructions, dateAvailable, dateDue, dateClosed } = req.body;
    Assignment
      .create({ courseId, type, instructions, dateAvailable, dateDue, dateClosed })
      .then(ass => res.send(ass))
      .catch(next);
  })
  .get('/:courseId', (req, res, next) => {
    const courseId = req.params.courseId;

    Assignment
      .find({ courseId, active: true })
      .lean()
      .then(allAsses => res.send(allAsses))
      .catch(next);
  })
  .get('/:courseId/inactive', (req, res, next) => {
    const courseId = req.params.courseId;

    Assignment
      .find({ courseId, active: false })
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
  .patch('/:id', checkAuth(TEACHER, TA), (req, res, next) => {
    Assignment
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .lean()
      .then(updatedAss => res.send(updatedAss))
      .catch(next);
  })
  .delete('/:id', checkAuth(TEACHER, TA), (req, res, next) => { 
    Assignment
      .findByIdAndUpdate(req.params.id, { active: false }, { new: true })
      .lean()
      .then(inactiveAss => res.send(inactiveAss))
      .catch(next);
  });
