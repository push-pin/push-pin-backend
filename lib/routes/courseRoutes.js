const { Router } = require('express');
const Course = require('../../lib/models/Course');
const { checkAuth } = require('../../lib/middleware/ensure-auth');
const { TEACHER } = require('../../lib/models/userRoles');

module.exports = Router()
  .post('/', checkAuth(TEACHER), (req, res, next) => {
    const { name, term, startDate, endDate, courseType } = req.body;
    Course
      .create({ name, term, startDate, endDate, courseType })
      .then(newCourse => res.send(newCourse))
      .catch(next);
  })
  .get('/', checkAuth(TEACHER), (req, res, next) => {
    Course
      .find({ active: true })
      .lean()
      .then(allActiveCourses => res.send(allActiveCourses))
      .catch(next);
  })
  .get('/inactive', checkAuth(TEACHER), (req, res, next) => {
    Course
      .find({ active: false })
      .lean()
      .then(allInactiveCourses => res.send(allInactiveCourses))
      .catch(next);
  })
  .get('/:courseId', (req, res, next) => {
    Course
      .findById(req.params.courseId)
      .lean()
      .then(allInactiveCourses => res.send(allInactiveCourses))
      .catch(next);
  })
  .patch('/:id', checkAuth(TEACHER), (req, res, next) => {
    Course
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .lean()
      .then(updatedCourse => res.send(updatedCourse))
      .catch(next);
  })
  .delete('/:id', checkAuth(TEACHER), (req, res, next) => { 
    Course
      .findByIdAndUpdate(req.params.id, { active: false }, { new: true })
      .lean()
      .then(inactiveCourse => res.send(inactiveCourse))
      .catch(next);
  });
