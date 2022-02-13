/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const Subscription = require('./subscription');

const memberSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  city: { type: String },
});

memberSchema.set('toJSON', {
  transform(document, obj) {
    obj.id = obj._id.toString();
    delete obj.__v;
    delete obj._id;
  },
});

memberSchema.pre('findOneAndDelete', async function () {
  const memberId = this.getQuery()._id;

  const deleted = await Subscription.findOneAndDelete({ memberId });
});

// memberSchema.post('save', async function () {
//   const memberId = this._id;
//   console.log('member id', memberId);
//   const createdMemberSubs = await Subscription.create({ memberId });
//   console.log('Member subs created..', createdMemberSubs);
// });

module.exports = mongoose.model('Member', memberSchema);
