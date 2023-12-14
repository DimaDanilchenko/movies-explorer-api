const Movie = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Movie.create({ name, link, owner: ownerId })
    .then((newMovie) => res.send(newMovie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'карточка или пользователь не найден.' });
      } else if (err.status === 500) {
        res.status(500).send({ message: 'на сервере произошла ошибка.' });
      } else {
        next(err);
      }
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
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id.toString()) {
        return next(new ForbiddenError({ message: 'ошибка удаления фильма' }));
      }
      return movie.remove()
        // eslint-disable-next-line no-undef
        .then(() => res.send({ message: FILM_DELETE_SUCCESS }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};
