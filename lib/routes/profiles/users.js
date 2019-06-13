const { Router } = require('express');
const User = require('../../models/profiles/User');
const { checkAuth, ensureAuth } = require('../../middleware/ensure-auth');
const { STUDENT, TEACHER, TA } = require('../../models/userRoles');

module.exports = Router()
  .post('/signup', ensureAuth(), checkAuth(STUDENT, TEACHER, TA), async(req, res, next) => {
    console.log('in route', req.body);
    res.send({ hi: 'hello' });
  });
