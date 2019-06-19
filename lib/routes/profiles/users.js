const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const { TEACHER, TA, STUDENT } = require('../../models/userRoles');
const User = require('../../models/profiles/User');
const Student = require('../../models/profiles/Student');
const Teacher = require('../../models/profiles/Teacher');
const TeacherAssistant = require('../../models/profiles/TeacherAssistant');
const Course = require('../../models/Course');
const { createAuth0User } = require('../../services/auth');

module.exports = Router()
  // ony teachers can sign up new users
  // sign up user to auth0 before creating mongodb user
  // depending on role in req body, sign up user type into mongodb
  // required to send firstName, lastName, email, currentCourse, role in every request
  // required to send ta userId if signing up a student
  .post('/', checkAuth(TEACHER), async(req, res, next) => {
    try {
      const { firstName, lastName, email, currentCourse, role, grader } = req.body;
      const newAuth0User = await createAuth0User(email, 'password!23');
      const auth0id = newAuth0User.user_id;
      // change in model to caps id
      const user = await User
        .create({ auth0id, firstName, lastName, email, role, grader });
      
      switch(role) {
        case TEACHER:
          return Teacher.create({ user: user._id, currentCourses: [currentCourse] })
            .then(newTeacher => {
              res.send({ user, newTeacher });
            });
        case TA:
          return TeacherAssistant.create({ user: user._id, currentCourse })
            .then(newTA => {
              res.send({ user, newTA });
            });
        case STUDENT:
          return Student.create({ user: user._id, currentCourse, grader })
            .then(newStudent => {
              res.send({ user, newStudent });
            });
      }
    } catch(error) {
      next(error);
    }
  })

  //get user by auth0id
  .get('/auth/:auth0id', checkAuth(TEACHER, TA, STUDENT), (req, res, next) => {
    const { auth0id } = req.params;
    User.findOne({ auth0id })
      .lean()
      .then(async(user) => {
        //populate user profile
        let profile = {};
        switch(user.role) {
          case TEACHER:
            profile = await Teacher.findOne({ user: user._id }).lean();
            break;
          case TA:
            profile = await TeacherAssistant.findOne({ user: user._id }).lean();
            break;
          case STUDENT:
            profile = await Student.findOne({ user: user._id }).lean();
            break;
        }
        return { user, profile };
      })
      .then(async(userProfile) => {
        if(userProfile.user.role === TEACHER) {
          const currentCourses = await Course.find(userProfile.profile.currentCourses);
          const user = { ...userProfile, currentCourses };
          res.send(user);
        }
        else {
          const currentCourses = await Course.find(userProfile.profile.currentCourse);   
          const user = { ...userProfile, currentCourses };
          res.send(user);
        }
      })
      .catch(next);
  });


