// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const InternalServerError = require('../errors/InternalServerError');

// eslint-disable-next-line no-unused-vars
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  const { email } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.send(user))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError({ message: 'переданы некорректные данные пользователя' }));
      }
      if (err.code === 'InternalServerError') {
        return next(new InternalServerError({ message: 'на сервере произошла ошибка.' }));
      }
      return next(err);
    });
};
module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким ID не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError({ message: 'переданы некорректные данные пользователя' }));
      }
      if (err.code === 'InternalServerError') {
        return next(new InternalServerError({ message: 'на сервере произошла ошибка.' }));
      }
      return next(err);
    });
};
