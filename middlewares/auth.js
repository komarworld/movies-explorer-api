const jwt = require('jsonwebtoken');
const UnAuthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw (new UnAuthorizedError('Необходима авторизаци'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key');
  } catch (err) {
    return next(new UnAuthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
