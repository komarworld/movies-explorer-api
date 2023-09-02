const {
  PORT = 4000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.exports = {
  PORT,
  MONGO_URL,
  NODE_ENV,
  JWT_SECRET,
};
