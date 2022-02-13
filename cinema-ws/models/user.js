/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  pwdHash: { type: String },
});

userSchema.set('toJSON', {
  transform(document, obj) {
    obj.id = obj._id.toString();
    delete obj.__v;
    delete obj._id;
    delete obj.pwdHash;
  },
});

userSchema.index({ username: 1 }, { unique: true, collation: { strength: 1, locale: 'en' } });

module.exports = mongoose.model('User', userSchema);
