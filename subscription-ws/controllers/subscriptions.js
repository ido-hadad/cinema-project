const express = require('express');
const {
  createSubscription,
  deleteSubscription,
  getSubscription,
  getSubscriptions,
} = require('../BL/subscriptions');

const router = express.Router();

router.get('/', async (req, res) => {
  const subscriptions = await getSubscriptions();
  res.json(subscriptions);
});

router.get('/:memberId', async (req, res) => {
  const { memberId } = req.params;
  const subscription = await getSubscription(memberId);
  if (!subscription) return res.sendStatus(404);
  return res.json(subscription);
});

router.post('/:memberId', async (req, res) => {
  const { memberId } = req.params;
  const { movieId, date } = req.body;
  const newSubscription = await createSubscription(memberId, movieId, date);

  res.status(201).json(newSubscription);
});

router.delete('/:memberId', async (req, res) => {
  const { memberId } = req.params;
  const { movieId } = req.body;
  const deletedSubscription = await deleteSubscription(memberId, movieId);
  //   if (!deletedSubscription)
  //     return res.sendStatus(404)
  res.sendStatus(204);
});

module.exports = router;
