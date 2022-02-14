const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const UserInfo = require('../DAL/userInfo');
const UserPermission = require('../DAL/userPermission');
const User = require('../models/user');
const config = require('../utils/config');
const Permissions = require('../utils/permissions');

const createUser = async (user) => {
  const createdUser = await User.create({
    username: user.username,
  });
  const userInfo = await UserInfo.create({ id: createdUser.id, ...user });
  const userPermisson = await UserPermission.create({ id: createdUser.id, ...user });

  return { ...userInfo, ...createdUser.toJSON(), ...userPermisson };
};

const removeUser = async (userId) => {
  const deleted = await User.findByIdAndDelete(userId);
  if (!deleted) return null;

  const userPermission = await UserPermission.remove(userId);
  const userInfo = await UserInfo.remove(userId);

  return { ...deleted.toJSON(), ...userPermission, ...userInfo };
};

const updateUser = async (user) => {
  const { id, username } = user;
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { username },
    { new: true, runValidators: true }
  );
  if (!updatedUser) return null;

  const updatedPermission = await UserPermission.update(user);
  const updatedInfo = await UserInfo.update(user);
  return { ...updatedUser.toJSON(), ...updatedPermission, ...updatedInfo };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  const userPermission = await UserPermission.getById(userId);
  const userInfo = await UserInfo.getById(userId);

  return { ...user.toJSON(), ...userPermission, ...userInfo };
};

const getUsers = async () => {
  const users = await User.find();
  const userPermissions = await UserPermission.get();
  const userInfos = await UserInfo.get();

  const usersMap = new Map();
  users.forEach((user) => usersMap.set(user.id, user.toJSON()));
  userPermissions.forEach((user) => Object.assign(usersMap.get(user.id), user));
  userInfos.forEach((user) => Object.assign(usersMap.get(user.id), user));

  return [...usersMap.values()];
};

const getDbUserByUsername = async (username) =>
  // could use lowercase on create/query instead
  // besides indexing, this allows us to have different case letters for display, also we can easily switch to match diacritics
  User.findOne({ username }).collation({ strength: 1, locale: 'en' });

const getUserByUsername = async (username) => {
  const user = await getDbUserByUsername(username);
  return user === null ? null : getUserById(user.id);
};

const userRequiresPassword = async (username) => {
  const user = await getDbUserByUsername(username);
  return user && user.pwdHash == null;
};

const userExists = async (username) => (await getUserByUsername(username)) !== null;

const setUserPassword = async (username, password) => {
  const user = await getDbUserByUsername(username);
  if (!user) return null;

  const saltRounds = 10;
  user.pwdHash = await bcrypt.hash(password, saltRounds);
  return (await user.save()).toJSON();
};

const checkLogin = async (username, password) => {
  const user = await getDbUserByUsername(username);
  if (!user || !user.pwdHash) return false;

  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.pwdHash);
  return passwordCorrect;
};

const createLoginToken = (id, username, permissions, timeout) => {
  const tokenData = {
    id,
    username,
    permissions,
  };

  const options = timeout ? { expiresIn: timeout * 60 } : {};
  const token = jwt.sign(tokenData, config.SECRET, options);

  return token;
};

const isAdminUsername = (username) =>
  username.toLowerCase() === config.ADMIN_USERNAME.toLowerCase();

const getNonAdminUsers = async () => {
  const users = await getUsers();
  return users.filter((user) => !isAdminUsername(user.username));
};

const initializeDatabase = async () => {
  console.log('initializing..');

  if (!fs.existsSync(config.DB_FOLDER)) {
    fs.mkdirSync(config.DB_FOLDER);
  }

  await UserInfo.init();
  await UserPermission.init();

  await User.deleteMany();
  await createUser({
    username: config.ADMIN_USERNAME,
    firstName: 'Administrator',
    permissions: Object.values(Permissions),
    sessionTimeout: 30,
  });
  if (await setUserPassword(config.ADMIN_USERNAME, config.ADMIN_PASSWORD))
    console.log(
      `System administrator user created. Username: ${config.ADMIN_USERNAME}, Password: ${config.ADMIN_PASSWORD}`
    );
  else {
    throw Error('Failed to create admin user');
  }
};

const userHasPermission = async (userId, permission) => {
  const user = await UserPermission.getById(userId);
  return user && user.permissions.includes(permission);
};

module.exports = {
  initializeDatabase,
  updateUser,
  removeUser,
  createUser,
  getUsers,
  getUserById,
  createLoginToken,
  checkLogin,
  userRequiresPassword,
  setUserPassword,
  getUserByUsername,
  userExists,
  userHasPermission,
  isAdminUsername,
  getNonAdminUsers,
};
