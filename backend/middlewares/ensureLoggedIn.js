const ensureLoggedIn = (req, res, next) => {
  console.log('REQQQQ', req);
  if (!req.user) {
    res.status(401);
    throw new Error('Unauthorized user');
  }

  next();
};

module.exports = ensureLoggedIn;
