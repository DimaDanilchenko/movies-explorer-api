const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, delMovieId,
} = require('../controllers/movie');

const createMovieValidation = require('../utils/validation/createMovieValidation');

router.get('/', getMovies);

router.post('/', createMovieValidation, createMovie);

router.delete('/_id', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), delMovieId);

module.exports = router;
