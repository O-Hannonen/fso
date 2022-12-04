const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGODB_URI } = require('./utils/config');
const { info, error } = require('./utils/logger');
const middleware = require('./utils/middleware');
const blogsRouter = require('./controllers/blog');
const usersRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const resetRouter = require('./controllers/reset');

const app = express();

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    info('connected to MongoDB');
  })
  .catch((e) => {
    error('error connection to MongoDB:', e.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', resetRouter);
}
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
