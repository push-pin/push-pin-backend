const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Assignment = require('../../models/assignments/Assignment');
const { TEACHER, TA } = require('../../models/userRoles');

module.exports = Router()
  .post('/', checkAuth(TEACHER, TA), (req, res, next) => {
    const { course, type, title, instructions, dateAvailable, dateDue, dateClosed } = req.body;
    let { pointsPossible } = req.body;
    if(!pointsPossible) {
      switch(type) {
        case 'reading':
          pointsPossible = 5;
          break;
        case 'solo':
          pointsPossible = 10;
          break;
        case 'mob':
          pointsPossible = 20;
          break;
        default:
          pointsPossible = 10;
      }
    }
    Assignment
      .create({ course, type, title, instructions, dateAvailable, dateDue, dateClosed, pointsPossible })
      .then(ass => res.send(ass))
      .catch(next);
  })

  //get all active asses for a course
  .get('/course/:course', (req, res, next) => {
    const course = req.params.course;
    Assignment
      .find({ course, active: true })
      .lean()
      .then(ass => res.send(ass))
      .catch(next);
  })

  //get all archived asses for a course
  .get('/course/inactive/:course', (req, res, next) => {
    const course = req.params.course;

    Assignment
      .find({ course, active: false })
      .lean()
      .then(allAsses => res.send(allAsses))
      .catch(next);
  })

  //get an assignment by id
  .get('/:id', (req, res, next) => {
    Assignment
      .findById(req.params.id)
      .lean()
      .then(assignment => res.send(assignment))
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
