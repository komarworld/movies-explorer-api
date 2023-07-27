const router = require('express').Router();
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

router.get('/', getMovies);

router.post('/', validateCreateMovie, createMovie);

router.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
