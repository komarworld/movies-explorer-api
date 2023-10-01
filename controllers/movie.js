const mongoose = require('mongoose');
const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-error'); // 400
const NotFoundError = require('../errors/not-found-error'); // 404
const ForbiddenError = require('../errors/forbidden-error'); // 403

const {
  STATUS_OK,
  CREATED,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .then((movies) => {
      res.status(STATUS_OK).send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав для удаления фильма');
      }
      Movie.deleteOne({ _id: movieId })
        .then((deletedMovie) => res.status(STATUS_OK).send(deletedMovie))
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            return next(new BadRequestError('Переданы некорректные данные'));
          }
          return next(err);
        });
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
