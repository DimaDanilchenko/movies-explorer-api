const Movie = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
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
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError({ message: 'переданы некорректные данные фильма' }));
      }
      return next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.find({ owner: ownerId })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.delMovieId = (req, res, next) => {
  const { movieId } = req.params;
  Movie
    .findById(movieId)
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

module.exports.delCardId = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .then((user) => res.send(user))
    .catch((err) => next(err));
};
