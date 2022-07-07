const passport = require('passport');
const User = require('../models/userModel');

/**
 * @desc Register new user
 * @route POST /api/users/register
 * @access Public
 */
const signup = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const name = { first: firstName, last: lastName };

  User.register(new User({ name, email }), password, (err, user) => {
    if (err) {
      res.status(401);
      return next(err);
    }

    req.login(user, err => {
      if (err) next(err);
      res.json(user);
    });
  });
};

/**
 * @desc Login user
 * @route POST /api/users/login
 * @access Public
 */
const login = (req, res) => {
  passport.authenticate('local')(req, res, () => res.json(req.user));
};

/**
 * @desc Logout user
 * @route POST /api/users/logout
 * @access Private
 */
const logout = (req, res, next) => {
  req.logout(err => {
    if (err) next(err);
    res.json({});
  });
};

module.exports = {
  login,
  logout,
  signup,
};
