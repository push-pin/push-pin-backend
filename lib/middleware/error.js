// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(err);
  res
    .status(err.status || 500)
    .send({
      error: err.message || err
    });
};
