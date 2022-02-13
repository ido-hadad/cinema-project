const http = require('http');
const mongoose = require('mongoose');
const config = require('./utils/config');
const app = require('./app');
const { initializeDatabase } = require('./BL/dbInit');

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to database.');
  } catch (error) {
    console.log('Failed to connect to database.', error);
    return;
  }

  try {
    await initializeDatabase();
    const server = http.createServer(app);
    server.listen(config.PORT, () => {
      console.log(`Server is listening on port ${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
