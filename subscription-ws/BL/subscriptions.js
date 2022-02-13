const mongoose = require('mongoose');
const Member = require('../models/member');
const Subscription = require('../models/subscription');

const getSubscriptions = () => Subscription.find(); // .populate('movies.movieId', { name: 1 });
const getSubscription = (memberId) => Subscription.findOne({ memberId });
const deleteSubscription = (memberId, movieId) =>
  Subscription.findOneAndUpdate({ memberId }, { $pull: { movies: { movieId } } });
const createSubscription = async (memberId, movieId, date) => {
  let memberSubs = await Subscription.findOne({ memberId });
  if (!memberSubs) {
    const existingMember = await Member.findById(memberId);
    if (!existingMember) return;

    memberSubs = await Subscription.create({ memberId });
  }

  const newMovies = memberSubs.movies.filter((sub) => sub.movieId.toString() !== movieId);
  newMovies.push({ movieId, date });

  memberSubs.movies = newMovies;

  return memberSubs.save();
};

module.exports = {
  getSubscriptions,
  getSubscription,
  deleteSubscription,
  createSubscription,
};
