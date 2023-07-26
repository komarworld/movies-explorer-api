const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error'); // 400
const NotFoundError = require('../errors/not-found-error'); // 404
const ConflictError = require('../errors/conflict-error'); // 409

const {
  STATUS_OK,
  CREATED,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;
// вход
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
        sameSite: true,
      }).send({ token, user });
    })
    .catch(next);
};
// выход
const logout = (req, res, next) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: true,
  })
    .send({ message: 'Успешный выход' });
  next();
};

// создание пользователя
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((newUser) => {
          res.status(CREATED).send(newUser);
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          }
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с таким email уже существует'));
          }
          return next(err);
        });
    });
};

// получение данных пользователя
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(STATUS_OK).send(user);
    })
    .catch(next);
};

// обновить даннные пользователя
const updateUser = (req, res, next) => {
  const { id } = req.user;
  const { name, email } = req.body;
  return User.findByIdAndUpdate(id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

module.exports = {
  login,
  logout,
  createUser,
  getUserInfo,
  updateUser,
};
