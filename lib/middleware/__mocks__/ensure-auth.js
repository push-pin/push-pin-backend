const checkAuth = (...roles) => (req, res, next) => {
  return next();
};

const ensureAuth = () => (req, res, next) => {
  return next();
};

module.exports = {
  checkAuth, 
  ensureAuth
};
