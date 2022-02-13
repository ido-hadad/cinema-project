const express = require('express');
const {
  createMember,
  deleteMember,
  getMember,
  getMembers,
  updateMember,
} = require('../BL/members');

const router = express.Router();

router.get('/', async (req, res) => {
  const members = await getMembers();
  res.json(members);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const member = await getMember(id);
  if (!member) return res.sendStatus(404);
  return res.json(member);
});

router.post('/', async (req, res) => {
  const { name, email, city } = req.body;
  const newMember = await createMember({ name, email, city });
  res.status(201).json(newMember);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deletedMember = await deleteMember(id);
  //   if (!deletedMember)
  //     return res.sendStatus(404)
  res.sendStatus(204);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, city } = req.body;
  const updatedMember = await updateMember(id, { name, email, city });
  res.json(updatedMember);
});

module.exports = router;
