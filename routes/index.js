const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { createUser, login, logout } = require('../controllers/user');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');

router.post('/signup', validateCreateUser, createUser);

router.post('/signin', validateLogin, login);

router.use(auth);

router.use('/users', userRoutes);

router.use('/movies', movieRoutes);

// router.get('/signout', logout);

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена!'));
});

module.exports = router;
