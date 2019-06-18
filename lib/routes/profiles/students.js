const { Router } = require('express');
const User = require('../../models/profiles/User');
const Student = require('../../models/profiles/Student');
const { checkAuth } = require('../../middleware/ensure-auth');
const { STUDENT, TEACHER, TA } = require('../../models/userRoles');

module.exports = Router()

  .get('/', checkAuth(TEACHER, TA), (req, res, next) => {
    Student
      .find()
      .populate('user', {
        firstName: true,
        lastName: true
      })
      .populate('currentCourse', {
        name: true,
        courseType: true, 
        term: true
      })
      .lean()
      .then(students => res.send(students))
      .catch(next);
  })

  .get('/:userId', (req, res, next) => {
    const { userId } = req.params;
    User.findById(userId)
      .lean()
      .then(user => {
        return Promise.all([
          user,
          Student.find({ user: userId })
        ]);
      })
      .then(([user, student]) => res.send({ user, student: student[0] }))
      .catch(next);
  });

//get students by course

//update a student's current course
//move currentClass into pastClasses, update currentClass
//.patch('/:studentId') route
