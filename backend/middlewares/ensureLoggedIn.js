const ensureLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Unauthorized user');
  }

  next();
};

module.exports = ensureLoggedIn;
