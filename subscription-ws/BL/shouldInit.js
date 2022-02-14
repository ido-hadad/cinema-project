const mongoose = require('mongoose');
const config = require('../utils/config');

// NOTE: this function is here because mongoose creates the collection as soon as
// the model is created so we have to run it before importing models
// could instead just persist a flag in a file/db after first init
async function shouldInitialize() {
  const collectionNames = (await mongoose.connection.db.listCollections().toArray()).map(
    (col) => col.name
  );
  if (config.RESET_DB_ON_STARTUP) return true;

  const required = ['movies', 'members'];
  return !required.every((element) => collectionNames.includes(element));
}

module.exports = shouldInitialize;
