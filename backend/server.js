const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const http = require('http');
const MongoStore = require('connect-mongo');
const { WebSocketServer } = require('ws');
const configurePassport = require('./config/passportConfig');
const db = require('./config/db');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT || 5000;

// create server & web socket
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// configure database
const clientPromise = db(wss);

// apply middlewares
app.use(express.json({ limit: process.env.REQUEST_LIMIT }));
app.use(
  express.urlencoded({
    extended: false,
    limit: process.env.REQUEST_LIMIT,
  })
);
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
app.get('/api/search', require('./controllers/searchController'));

// // use static files [production]
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')));

//   app.get('*', (req, res) =>
//     res.sendFile(
//       path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
//     )
//   );
// }

app.use(require('./middlewares/errorHandler'));

server.listen(port, () => console.log(`Server started on port ${port}`));
