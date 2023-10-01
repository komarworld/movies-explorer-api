require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');
const limiter = require('./middlewares/limiter');

const errorHandler = require('./middlewares/error-handler');
const {
  PORT,
  MONGO_URL,
} = require('./utils/config');
const { corsMid } = require('./middlewares/cors');

mongoose.connect(MONGO_URL).then(() => {
  console.log('connected to db');
});

const app = express();

app.use(helmet());
app.use(corsMid);
app.use(express.json());

app.use(requestLogger);

app.use(limiter);
app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is on the ${PORT}`);
});
