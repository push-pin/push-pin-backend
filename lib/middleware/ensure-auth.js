const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const User = require('../models/profiles/User');


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

const checkAuth = (...roles) => (req, res, next) => {
  User
    .findOne({ auth0id: req.user.sub })
    .then(user => {
      req.pushPinUser = user;
      if(roles.includes(user.role)) return next();
      else {
        const error = new Error('Invalid Authorization');
        error.status = 401;
        return next(error);
      }
    });
};

module.exports = {
  ensureAuth,
  checkAuth
};
