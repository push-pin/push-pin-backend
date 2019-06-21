const { Router } = require('express');
const User = require('../../models/profiles/User');
const Teacher = require('../../models/profiles/Teacher');
const { checkAuth } = require('../../middleware/ensure-auth');
const { TEACHER } = require('../../models/userRoles');
const { createAuth0User } = require('../../services/auth');

module.exports = Router()
  .post('/', checkAuth(TEACHER), async(req, res, next) => {
    try {
      const { firstName, lastName, email, currentCourse } = req.body;
      const newAuth0User = await createAuth0User(email, 'password!23');
      const auth0id = newAuth0User.user_id;
      const user = await User
        .create({ auth0id, firstName, lastName, email, role: TEACHER });
      const teacher = await Teacher.create({ user: user._id, courses: [currentCourse] });
      res.send({ firstName, lastName, email, user: user._id, ...teacher.toJSON() });
    } catch(error) {
      next(error);
    }
  })

  .get('/', (req, res, next) => {
    Teacher
      .find()
      .populate('courses', {
        name: true,
        courseType: true, 
        term: true
      })
      .lean()
      .then(teachers => res.send(teachers))
      .catch(next);
  });
