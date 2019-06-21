const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const { TEACHER, TA, STUDENT } = require('../../models/userRoles');
const User = require('../../models/profiles/User');
const Student = require('../../models/profiles/Student');
const Teacher = require('../../models/profiles/Teacher');
const TeacherAssistant = require('../../models/profiles/TeacherAssistant');
const Course = require('../../models/Course');

module.exports = Router()
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

