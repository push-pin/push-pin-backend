const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const ensureAuth = () => jwt({
  credentialsRequired: process.env.NODE_ENV !== 'test',
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_CLIENT_ID,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

const studentAuth = (req, res, next) => {
  if(req.user.role !== 'student') {
    const error = new Error('Invalid Authorization: Not a Student');
    error.status = 401;
    return next(error);
  }
  return next();
};

const teacherAuth = (req, res, next) => {
  if(req.user.role !== 'teacher') {
    const error = new Error('Invalid Authorization: Not a Teacher');
    error.status = 401;
    return next(error);
  }
  return next();
};

const adminAuth = (req, res, next) => {
  if(req.user.role !== 'teacher' && req.user.role !== 'teacher') {
    const error = new Error('Invalid Authorization: Not an Admin');
    error.status = 401;
    return next(error);
  }
  return next();
};

module.exports = {
  ensureAuth,
  studentAuth,
  teacherAuth,
  adminAuth
};
