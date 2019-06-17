const { Router } = require('express');
const User = require('../../models/profiles/User');
const TeacherAssistant = require('../../models/profiles/TeacherAssistant');
const Teacher = require('../../models/profiles/Teacher');
const { checkAuth } = require('../../middleware/ensure-auth');
const { STUDENT, TEACHER, TA } = require('../../models/userRoles');

module.exports = Router()
//add a new TA
  .post('/ta', checkAuth(TEACHER), async(req, res, next) => {
    try {
      const { auth0id, firstName, lastName, email, currentCourse } = req.body;
      const user = await User
        .create({ auth0id, firstName, lastName, email, role: TA });
      const ta = await TeacherAssistant.create({ user: user._id, currentCourse });
      res.send({ firstName, lastName, email, user: user._id, ...ta.toJSON() });
    } catch(error) {
      next(error);
    }
  })

  //add a new teacher
  .post('/teacher', checkAuth(TEACHER), async(req, res, next) => {
    try {
      const { auth0id, firstName, lastName, email, currentCourse } = req.body;
      const user = await User
        .create({ auth0id, firstName, lastName, email, role: TEACHER });
      const teacher = await Teacher.create({ user: user._id, courses: [currentCourse] });
      res.send({ firstName, lastName, email, user: user._id, ...teacher.toJSON() });
    } catch(error) {
      next(error);
    }
  })

  //get all TAs
  .get('/ta', (req, res, next) => {
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

  //update a TA's course, put their current course in past courses
  .patch('/ta/:id', checkAuth(TEACHER), (req, res, next) => {
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
