const { Router } = require('express');
const User = require('../../models/profiles/User');
const Student = require('../../models/profiles/Student');
const { checkAuth } = require('../../middleware/ensure-auth');
const { TEACHER, TA } = require('../../models/userRoles');
const { createAuth0User } = require('../../services/auth');

module.exports = Router()
  .post('/', checkAuth(TEACHER), async(req, res, next) => {
    const { firstName, lastName, email, currentCourse, grader } = req.body;
    const newAuth0User = await createAuth0User(email, 'password!23');
    const auth0id = newAuth0User.user_id;
    const role = 'student';

    const user = await User
      .create({ auth0id, firstName, lastName, email, role, grader });
    
    Student.create({ user: user._id, currentCourse, grader })
      .then(student => {
        res.send({ user, student });
      })
      .catch(next);
  })
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

//update a student's current course
//move currentClass into pastClasses, update currentClass
//.patch('/:studentId') route
