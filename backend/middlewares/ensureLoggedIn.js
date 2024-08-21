const ensureLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401);
    throw new Error('Unauthorized user');
  }

  next();
};

module.exports = ensureLoggedIn;
