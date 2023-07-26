const STATUS_OK = 200;
const CREATED = 201;
const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;
const SERVER_ERROR = 500;

const REG_URL = /(https?:\/\/)(www)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=])*#?$/;

module.exports = {
  STATUS_OK,
  NOT_FOUND_ERROR,
  CREATED,
  BAD_REQUEST_ERROR,
  SERVER_ERROR,
  REG_URL,
};
