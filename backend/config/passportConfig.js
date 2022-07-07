const User = require('../models/userModel');

const configurePassport = passport => {
  passport.use(User.createStrategy());
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};

module.exports = configurePassport;
