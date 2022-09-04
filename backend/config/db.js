const mongoose = require('mongoose');
const WebSocket = require('ws');

// Database Connection
function db(wss) {
  const clientPromise = mongoose
    .connect(process.env.MONGO_URI)
    .then(mongo => {
      const db = mongo.connection;
      console.log(`Databse Connected: ${db.host}`);

      // watch database for changes
      const changeStream = db.watch();
      changeStream.on('change', next => {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(next));
          }
        });
      });

      return db.getClient();
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });

  return clientPromise;
}

module.exports = db;
