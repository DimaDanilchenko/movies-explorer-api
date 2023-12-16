const Movie = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Movie.create({ name, link, owner: ownerId })
    .then((newMovie) => res.send(newMovie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError({ message: 'переданы некорректные данные фильма' }));
      }
      return next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.delMovieId = (req, res, next) => {
  const { filmId } = req.params;
  Movie
    .findById(filmId)
    .orFail(new NotFoundError({ message: 'фильм не найден' }))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError({ message: 'ошибка удаления фильма' }));
      }
      return movie.remove()
        // eslint-disable-next-line no-undef
        .then(() => res.send({ message: 'фильм успешно удален' }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};
