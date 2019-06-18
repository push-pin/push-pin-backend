const { Router } = require('express');
const User = require('../../models/profiles/User');
const TeacherAssistant = require('../../models/profiles/TeacherAssistant');
const { checkAuth } = require('../../middleware/ensure-auth');
const { TEACHER, TA } = require('../../models/userRoles');
const { createAuth0User } = require('../../services/auth');

module.exports = Router()
  .post('/', checkAuth(TEACHER), async(req, res, next) => {
    try {
      const { firstName, lastName, email, currentCourse } = req.body;
      const newAuth0User = await createAuth0User(email, 'password!23');
      const auth0id = newAuth0User.user_id;
      const user = await User
        .create({ auth0id, firstName, lastName, email, role: TA });
      const ta = await TeacherAssistant.create({ user: user._id, currentCourse });
      res.send({ firstName, lastName, email, user: user._id, ...ta.toJSON() });
    } catch(error) {
      next(error);
    }
  })

  .get('/', (req, res, next) => {
    TeacherAssistant
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
      .populate('pastCourses', {

      })
      .lean()
      .then(tas => res.send(tas))
      .catch(next);
  })

  .patch('/:id', checkAuth(TEACHER), (req, res, next) => {
    const { newCourse } = req.body;
    TeacherAssistant
      .findById(req.params.id)
      .then(ta => {
        const pastCourseArray = ta.pastCourses;
        const lastCurrentCourse = ta.currentCourse;
        TeacherAssistant
          .findByIdAndUpdate(req.params.id, {
            currentCourse: newCourse,
            pastCourses: [...pastCourseArray, lastCurrentCourse]
          }, { new: true })
          .lean()
          .then(updatedTA => res.send(updatedTA))
          .catch(next);
      });
  });
