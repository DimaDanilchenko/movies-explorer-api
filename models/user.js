const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line no-useless-escape
const regex = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;
// eslint-disable-next-line import/no-extraneous-dependencies
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  // about: {
  //   type: String,
  //   minlength: 2,
  //   maxlength: 30,
  //   default: 'Исследователь',
  // },
  // avatar: {
  //   type: String,
  //   default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  //   validate: {
  //     validator(link) {
  //       return link.match(regex);
  //     },
  //   },
  // },
  email: {
    type: String,
    validate: {
      validator(email) {
        return isEmail(email);
      },
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => bcrypt.compare(password, user.password));
};
module.exports = mongoose.model('user', userSchema);
