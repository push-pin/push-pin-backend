const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Assignment = require('../../models/assignments/Assignment');
const { TEACHER, TA } = require('../../models/userRoles');

module.exports = Router()
  .post('/', checkAuth(TEACHER, TA), (req, res, next) => {
    const { course, type, title, instructions, dateAvailable, dateDue, dateClosed } = req.body;
    Assignment
      .create({ course, type, title, instructions, dateAvailable, dateDue, dateClosed })
      .then(ass => res.send(ass))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Assignment
      .findById(req.params.id)
      .lean()
      .then(assignment => res.send(assignment))
      .catch(next);
  })
  .get('/course/:course', (req, res, next) => {
    const course = req.params.course;
    Assignment
      .find({ course, active: true })
      .lean()
      .then(ass => res.send(ass))
      .catch(next);
  })
  .get('/course/inactive/:course', (req, res, next) => {
    const course = req.params.course;

    Assignment
      .find({ course, active: false })
      .lean()
      .then(allAsses => res.send(allAsses))
      .catch(next);
  })
  .get('/weekataglance/:course', (req, res, next) => {
    const { course } = req.params;
    // day range is huge because seed data spans like 200 years
    // its fineeeeeeee
    const today = new Date();
    const diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
    const monday =  new Date(today.setDate(diff));
    
    
    const dateRange = (365 * 9);
    const endDate = new Date(today.setDate(today.getDate() + dateRange));
    // set monday time to 000000000



    Assignment.weekAtAGlance(monday, endDate, course)
      .then(thisWeeksAsses => res.send(thisWeeksAsses))
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
