require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');

const errorHandler = require('./middlewares/error-handler');
const {
  PORT,
  MONGO_URL,
} = require('./utils/config');

mongoose.connect(MONGO_URL).then(() => {
  console.log('connected to db');
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is on the ${PORT}`);
});
