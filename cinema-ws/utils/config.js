require('dotenv').config();

const { PORT, NODE_ENV, SECRET, ADMIN_PASSWORD, ADMIN_USERNAME } = process.env;

const MONGODB_URI = NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
const RESET_USERS_ON_STARTUP = (process.env.RESET_USERS_ON_STARTUP ?? 'false') !== 'false';
const DB_FOLDER = process.env.DB_FOLDER || 'db';

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET,
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  RESET_USERS_ON_STARTUP,
  DB_FOLDER,
};
