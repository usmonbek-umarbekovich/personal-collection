const passport = require('passport');
const User = require('../models/userModel');
const mongoose = require('mongoose');

/**
 * @desc Register new user
 * @route POST /api/users/register
 * @access Public
 */
const signup = (req, res, next) => {
  const { firstName, lastName, email, bio, avatar, password } = req.body;

  const userData = {
    name: { first: firstName, last: lastName },
    email,
    bio,
    avatar,
  };

  User.register(new User(userData), password, (err, user) => {
    if (err) {
      if (err) next(err);
      res.status(401);
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
const login = (req, res, next) => {
  passport.authenticate('local', (_, user, err) => {
    if (err) {
      res.status(401);
      return next(err);
    }

    req.login(user, err => {
      if (err) next(err);
      res.json(user);
    });
  })(req, res, () => res.json(req.user));
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
