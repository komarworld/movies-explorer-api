const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/unauthorized-error');

const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error'); // 400
const NotFoundError = require('../errors/not-found-error'); // 404
const ConflictError = require('../errors/conflict-error'); // 409

const { NODE_ENV, JWT_SECRET } = process.env;

const {
  STATUS_OK,
  CREATED,
} = require('../utils/constants');

/*
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnAuthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnAuthorizedError('Неправильные почта или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key',
            { expiresIn: '7d' },
          );
          return res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};
*/


// вход
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key', { expiresIn: '7d' });
      res.send({ token, user });
    })
    .catch(next);
};


// создание пользователя
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((newUser) => {
          const { _id } = newUser;
          res.status(CREATED).send({ _id, email, name });
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
  const { _id } = req.user;
  const { name, email } = req.body;
  User.findByIdAndUpdate(_id, { name, email }, {
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
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

/*
// выход- добавить для куки
const logout = (req, res, next) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: true,
  })
    .send({ message: 'Успешный выход' });
  next();
};
*/

module.exports = {
  login,
  createUser,
  getUserInfo,
  updateUser,
};
