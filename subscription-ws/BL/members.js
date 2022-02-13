const Member = require('../models/member');

const getMembers = () => Member.find();
const getMember = (id) => Member.findById(id);
const deleteMember = (id) => Member.findByIdAndDelete(id);
const createMember = (member) => Member.create(member);
const updateMember = (id, member) => Member.findByIdAndUpdate(id, member, { new: true });

module.exports = { getMembers, getMember, deleteMember, createMember, updateMember };
