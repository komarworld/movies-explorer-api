const { SERVER_ERROR } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR
      ? 'Ошибка Сервера'
      : message,
  });
  next();
};

module.exports = errorHandler;
