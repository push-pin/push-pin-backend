const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const { TEACHER } = require('../../models/userRoles');
const User = require('../../models/profiles/User');
const Student = require('../../models/profiles/Student');
const Teacher = require('../../models/profiles/Teacher');
const TeacherAssistant = require('../../models/profiles/TeacherAssistant');
const { createAuth0User } = require('../../services/auth');

module.exports = Router()
  // ony teachers can sign up new users
  // sign up user to auth0 before creating mongodb user
  // depending on role in req body, sign up user type into mongodb
  // required to send firstName, lastName, email, currentCourse, role in every request
  // required to send ta userId if signing up a student
  .post('/', checkAuth(TEACHER), async(req, res, next) => {
    try {
      const { firstName, lastName, email, currentCourse, role, ta } = req.body;
      const newAuth0User = await createAuth0User(email, 'password!23');
      const auth0id = newAuth0User.user_id;
      // change in midel to caps id
      const user = await User
        .create({ auth0id, firstName, lastName, email, role });
      
      switch(role) {
        case 'teacher':
          return Teacher.create({ user: user._id, currentCourses: [currentCourse] })
            .then(newTeacher => {
              res.send({ user, newTeacher });
            });
        case 'ta':
          return TeacherAssistant.create({ user: user._id, currentCourse })
            .then(newTA => {
              res.send({ user, newTA });
            });
        case 'student':
          return Student.create({ user: user._id, currentCourse, ta })
            .then(newStudent => {
              res.send({ user, newStudent });
            });
      }
    } catch(error) {
      next(error);
    }
  });

