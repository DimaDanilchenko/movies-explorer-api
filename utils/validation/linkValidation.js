const validator = require('validator');

const linkValidation = (value, helpers, linkText) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message(`Поле ${linkText} заполнено некорректно.`);
};

module.exports = linkValidation;
