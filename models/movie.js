const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line no-useless-escape
const regex = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;

const cardSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  direction: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return link.match(regex);
      },
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return link.match(regex);
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return link.match(regex);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return link.match(regex);
      },
    },
  },
});

module.exports = mongoose.model('card', cardSchema);
