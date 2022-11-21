const morgan = require('morgan');
const { error } = require('./logger');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (request, _, next) => {
  const authorization = request.get('authorization');
  request.decodedToken = {};

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    request.decodedToken = decodedToken;
  }

  next();
};

const userExtractor = async (request, _, next) => {
  request.user = {};

  if (request.decodedToken.id) {
    request.user = await User.findById(request.decodedToken.id);
  }
  next();
};

const errorHandler = (e, request, response, next) => {
  console.log('errorHandler catched error', e.name);
  error(e.message);

  if (e.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (e.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (e.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    });
  } else if (e.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }

  next(e);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
