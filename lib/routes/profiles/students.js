const { Router } = require('express');
const User = require('../../models/profiles/User');
const Student = require('../../models/profiles/Student');
const { checkAuth } = require('../../middleware/ensure-auth');
const { STUDENT, TEACHER, TA } = require('../../models/userRoles');

module.exports = Router()
  //add a new student
  .post('/', checkAuth(TEACHER), async(req, res, next) => {
    try {
      const { auth0id, firstName, lastName, email, currentClass } = req.body;
      const user = await User
        .create({ auth0id, firstName, lastName, email, role: STUDENT });
      const student = await Student.create({ userId: user._id, currentClass });
      res.send({ firstName, lastName, email, userId: user._id, ...student.toJSON() });
    } catch(error) {
      next(error);
    }
  });

//update a student's current course
//move currentClass into pastClasses, update currentClass
//.patch('/:studentId') route
