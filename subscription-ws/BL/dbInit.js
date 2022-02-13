const mongoose = require('mongoose');
const config = require('../utils/config');
const Member = require('../models/member');
const Movie = require('../models/movie');
const usersService = require('../services/usersService');
const moviesService = require('../services/moviesService');
const Subscription = require('../models/subscription');

const initMemberCollection = async () => {
  console.log('initializing Member collection..');
  await Member.deleteMany();

  const users = await usersService.getAll();
  const members = users.map((user) => ({
    name: user.name,
    email: user.email,
    city: user.address.city,
  }));

  await Member.insertMany(members);
};
const initMovieCollection = async () => {
  console.log('initializing Movie collection..');
  await Movie.deleteMany();

  const rawMovies = await moviesService.getAll();
  const movies = rawMovies.map((movie) => ({
    name: movie.name,
    genres: movie.genres,
    image: movie.image.medium,
    premiered: movie.premiered,
  }));

  await Movie.insertMany(movies);
};

const initSubscriptionCollection = async () => {
  await Subscription.deleteMany();
};

async function shouldInitialize() {
  const collections = await mongoose.connection.db.listCollections().toArray();
  const collectionNames = collections.map((col) => col.name);
  if (config.RESET_DB_ON_STARTUP) return true;

  return [Movie.collection.name, Member.collection.name].some(
    (col) => !collectionNames.includes(col)
  );
}

async function initializeDatabase() {
  if (!(await shouldInitialize())) return;
  const initializers = [
    initMemberCollection(),
    initMovieCollection(),
    initSubscriptionCollection(),
  ];

  await Promise.all(initializers);
}

module.exports = { initializeDatabase };
