const express = require('express');
const { createMovie, deleteMovie, getMovie, getMovies, updateMovie } = require('../BL/movies');

const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await getMovies();
  res.json(movies);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const movie = await getMovie(id);
  if (!movie) return res.sendStatus(404);
  return res.json(movie);
});

router.post('/', async (req, res) => {
  const { name, genres, image, premiered } = req.body;
  const newMovie = await createMovie({ name, genres, image, premiered });
  res.status(201).json(newMovie);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deletedMovie = await deleteMovie(id);
  //   if (!deletedMovie)
  //     return res.sendStatus(404)
  res.sendStatus(204);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, genres, image, premiered } = req.body;
  const updatedMovie = await updateMovie(id, { name, genres, image, premiered });
  res.json(updatedMovie);
});

module.exports = router;
