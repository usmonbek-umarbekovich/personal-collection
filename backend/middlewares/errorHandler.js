const errorHandler = (err, req, res, next) => {
  if (res.statusCode === 200) {
    res.status(400);
  }
  res.status(res.statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
