const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
require('express-async-errors');

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.status(200).json(users);
});

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be at least 3 characters long' });
  }

  if (!username || username.length < 3) {
    return response
      .status(400)
      .json({ error: 'username must be at least 3 characters long' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: 'username taken',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const userData = {
    username,
    name,
    passwordHash,
  };

  const user = new User(userData);
  const result = await user.save();
  response.status(201).json(result);
});

module.exports = userRouter;
