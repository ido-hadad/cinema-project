const express = require('express');

const {
  checkLogin,
  createLoginToken,
  getUserByUsername,
  userRequiresPassword,
  setUserPassword,
  userExists,
  isAdminUsername,
} = require('../BL/users');

const loginRouter = express.Router();

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const loginValid = await checkLogin(username, password);

  if (!loginValid) {
    return response.status(200).json({
      error: 'Invalid username or password',
    });
  }

  const user = await getUserByUsername(username);
  const token = createLoginToken(user.id, username, user.permissions, user.sessionTimeout);

  response.json({
    user: {
      token,
      username,
      id: user.id,
      permissions: user.permissions,
      isAdmin: isAdminUsername(user.username),
      name: [user.firstName, user.lastName].join(' ').trim(),
      expiresAt: user.sessionTimeout
        ? Math.floor(Date.now() / 1000) + user.sessionTimeout * 60
        : null,
    },
  });
});

loginRouter.post('/create', async (req, res) => {
  const { username, password } = req.body;

  if (!(await userExists(username)))
    return res.status(400).json({ error: 'User does not exist, please contact Admin' });
  if (!(await userRequiresPassword(username)))
    return res.status(400).json({ error: 'Account was already setup for that username' });

  await setUserPassword(username, password);
  res.sendStatus(200);
});

module.exports = loginRouter;
