const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const configurePassport = require('./config/passportConfig');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT || 5000;

// Database Connection
const clientPromise = mongoose
  .connect(process.env.MONGO_URI)
  .then(mongo => {
    const db = mongo.connection;
    console.log(`Databse Connected: ${db.host}`);

    return db.getClient();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    name: 'application',
    store: MongoStore.create({
      clientPromise,
      stringify: false,
      touchAfter: 24 * 3600,
    }),
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// use static files [production]
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
}

app.use(require('./middlewares/errorHandler'));

app.listen(port, () => console.log(`Server started on port ${port}`));
