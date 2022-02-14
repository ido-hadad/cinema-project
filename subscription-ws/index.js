const mongoose = require('mongoose');
const http = require('http');
const config = require('./utils/config');
const shouldInitialize = require('./BL/shouldInit');

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to database.');
  } catch (error) {
    console.log('Failed to connect to database.', error);
    return;
  }

  try {
    // model imports must not be before collection check
    if (await shouldInitialize()) {
      const initializeDatabase = require('./BL/dbInit');
      await initializeDatabase();
    }
    const app = require('./app');
    const server = http.createServer(app);
    server.listen(config.PORT, () => {
      console.log(`Server is listening on port ${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
    await mongoose.disconnect();
  }
})();
