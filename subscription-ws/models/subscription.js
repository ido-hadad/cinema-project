/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  movies: [
    {
      movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
      date: { type: Date, default: Date.now },
      _id: false,
    },
  ],
});

subscriptionSchema.set('toJSON', {
  transform(document, obj) {
    obj.id = obj._id.toString();
    delete obj.__v;
    delete obj._id;
  },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
