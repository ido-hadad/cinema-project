const mongoose = require('mongoose');
const config = require('../utils/config');
const UserInfo = require('../DAL/userInfo');
const UserPermission = require('../DAL/userPermission');

/* 
isolated file is needed because we cant import mongoose models before running this
importing models will create the collection
*/
const shouldInitialize = async () => {
  if (config.RESET_USERS_ON_STARTUP) return true;
  const collections = await mongoose.connection.db.listCollections({ name: 'users' }).toArray();

  return (
    collections.length === 0 ||
    (await UserInfo.shouldInitialize()) ||
    UserPermission.shouldInitialize()
  );
};

module.exports = shouldInitialize;
