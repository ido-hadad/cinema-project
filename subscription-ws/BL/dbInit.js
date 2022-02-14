const Member = require('../models/member');
const Movie = require('../models/movie');
const usersService = require('../services/usersService');
const moviesService = require('../services/moviesService');
const Subscription = require('../models/subscription');

async function initMemberCollection() {
  console.log('initializing Member collection..');
  await Member.deleteMany();

  const users = await usersService.getAll();
  const members = users.map((user) => ({
    name: user.name,
    email: user.email,
    city: user.address.city,
  }));

  await Member.insertMany(members);
}

async function initMovieCollection() {
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
}

async function initSubscriptionCollection() {
  await Subscription.deleteMany();
}

async function initializeDatabase() {
  const initializers = [
    initMemberCollection(),
    initMovieCollection(),
    initSubscriptionCollection(),
  ];

  await Promise.all(initializers);
}

module.exports = initializeDatabase;
