const Card = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((newCard) => res.send(newCard))
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

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};
module.exports.delCardId = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((user) => res.send(user))
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

