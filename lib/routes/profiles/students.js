const { Router } = require('express');
const User = require('../../models/profiles/User');
const Student = require('../../models/profiles/Student');
const { checkAuth } = require('../../middleware/ensure-auth');
const { STUDENT, TEACHER, TA } = require('../../models/userRoles');

module.exports = Router()
  //add a new student: teacher only
  .post('/', checkAuth(TEACHER), async(req, res, next) => {
    try {
      const { auth0id, firstName, lastName, email, currentCourse } = req.body;
      const user = await User
        .create({ auth0id, firstName, lastName, email, role: STUDENT });
      const student = await Student.create({ user: user._id, currentCourse });
      res.send({ firstName, lastName, email, user: user._id, ...student.toJSON() });
    } catch(error) {
      next(error);
    }
  })
  
  //get a list of all students: teachers and tas
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
  });

//update a student's current course
//move currentClass into pastClasses, update currentClass
//.patch('/:studentId') route
