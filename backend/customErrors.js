module.exports.notAuthorizedError = function (res) {
  res.status(401);
  throw new Error('You are not authorized to perform this operation');
};

module.exports.notFoundError = function (res, arg) {
  res.status(400);
  throw new Error(`${arg} not found`);
};
