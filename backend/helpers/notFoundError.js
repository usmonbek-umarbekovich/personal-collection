function notFoundError(res, arg) {
  res.status(400);
  throw new Error(`${arg} not found`);
}

module.exports = notFoundError;
