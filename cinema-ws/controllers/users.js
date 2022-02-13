const express = require('express');
const {
  // getUsers,
  getUserById,
  createUser,
  removeUser,
  updateUser,
  getNonAdminUsers,
} = require('../BL/users');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await getNonAdminUsers();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) return res.sendStatus(404);
  return res.json(user);
});

router.post('/', async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000)
      // mongodb duplicate key
      return res.status(400).json({ field_errors: { username: 'Username is already taken.' } });
    throw error;
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deletedUser = await removeUser(id);
  //   if (!deletedUser)
  //     return res.sendStatus(404)
  res.sendStatus(204);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await updateUser({ ...req.body, id });
    res.json(updatedUser);
  } catch (error) {
    if (error.code === 11000)
      // mongodb duplicate key
      return res.status(400).json({ field_errors: { username: 'Username is already taken' } });
    throw error;
  }
});

module.exports = router;
