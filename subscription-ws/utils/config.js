require('dotenv').config();

const { PORT, NODE_ENV, SECRET } = process.env;
MONGODB_URI = NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
const RESET_DB_ON_STARTUP = (process.env.RESET_DB_ON_STARTUP ?? 'false') !== 'false';

module.exports = {
  PORT,
  MONGODB_URI,
  RESET_DB_ON_STARTUP,
  SECRET,
};
