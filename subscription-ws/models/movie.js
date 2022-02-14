/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const Subscription = require('./subscription');

const movieSchema = new mongoose.Schema({
  name: { type: String },
  genres: [{ type: String }],
  image: { type: String },
  premiered: { type: String },
});

movieSchema.pre('findOneAndDelete', { query: true, document: true }, async function () {
  const movieId = this.getQuery()._id;

  await Subscription.updateMany({}, { $pull: { movies: { movieId } } });
});

movieSchema.set('toJSON', {
  transform(document, obj) {
    obj.id = obj._id.toString();
    delete obj.__v;
    delete obj._id;
  },
});

module.exports = mongoose.model('Movie', movieSchema);
