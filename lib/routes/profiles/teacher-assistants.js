const { Router } = require('express');
const User = require('../../models/profiles/User');
const TeacherAssistant = require('../../models/profiles/TeacherAssistant');
const { checkAuth } = require('../../middleware/ensure-auth');
const { STUDENT, TEACHER, TA } = require('../../models/userRoles');

module.exports = Router()
  .post('/', checkAuth(TEACHER), async(req, res, next) => {
    try {
      const { auth0id, firstName, lastName, email, currentCourse } = req.body;
      const user = await User
        .create({ auth0id, firstName, lastName, email, role: TA });
      const ta = await TeacherAssistant.create({ user: user._id, currentCourse });
      res.send({ firstName, lastName, email, user: user._id, ...ta.toJSON() });
    } catch(error) {
      next(error);
    }
  });
