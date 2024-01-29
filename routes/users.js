const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const {
  updateProfile, getProfile,
} = require('../controllers/users');

router.get('/', getProfile);

router.patch('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().trim().email().required(),
  }),
}), updateProfile);

module.exports = router;
