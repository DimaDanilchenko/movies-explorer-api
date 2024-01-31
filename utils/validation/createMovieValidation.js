const { celebrate, Joi } = require('celebrate');

const linkValidation = require('./linkValidation');

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => linkValidation(value, helpers, 'image')),
    trailerLink: Joi.string().required().custom((value, helpers) => linkValidation(value, helpers, 'trailerLink')),
    thumbnail: Joi.string().required().custom((value, helpers) => linkValidation(value, helpers, 'thumbnail')),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = createMovieValidation;
