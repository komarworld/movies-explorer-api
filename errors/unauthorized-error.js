const { UNAUTHORIZED_ERROR } = require('../utils/constants');

class UnAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}

module.exports = UnAuthorizedError;
