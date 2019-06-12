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

// const studentAuth = (req, res, next) => {
  
// };

// const teacherAuth = (req, res, next) => {
  
// };


// const adminAuth = (req, res, next) => {
//   //checks for TA or Teacher auth
// };

module.exports = {
  ensureAuth,
//   studentAuth,
//   teacherAuth,
//   adminAuth
};
