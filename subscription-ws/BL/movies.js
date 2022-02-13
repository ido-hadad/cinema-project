const Movie = require('../models/movie');

const getMovies = () => Movie.find();
const getMovie = (id) => Movie.findById(id);
const deleteMovie = (id) => Movie.findByIdAndDelete(id);
const createMovie = (movie) => Movie.create(movie);
const updateMovie = (id, movie) => Movie.findByIdAndUpdate(id, movie, { new: true });

module.exports = { getMovies, getMovie, deleteMovie, createMovie, updateMovie };
