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

const checkAuth = (...roles) => (req, res, next) => {
  if(roles.includes(req.user['http://pushpin.com/userRole'])) return next();
  else {
    const error = new Error('Invalid Authorization');
    error.status = 401;
    return next(error);
  }
};

module.exports = {
  ensureAuth,
  checkAuth
};

