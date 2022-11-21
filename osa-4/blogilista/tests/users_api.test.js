const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const helper = require('./users_helper');
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash: 'testpassword',
  });
  await user.save();
});

describe('test /api/users', () => {
  test('users are returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all users are returned', async () => {
    const response = await api.get('/api/users');
    expect(response.body).toHaveLength(1);
  });

  test('users are identified with id, not _id', async () => {
    const response = await api.get('/api/users');
    expect(response.body[0].id).toBeDefined();
  });

  test('a invalid user cannot be added', async () => {
    // Username is taken
    const r1 = await api.post('/api/users').send({
      username: 'testuser',
      name: 'Test User',
      password: 'testpassword',
    });
    expect(r1.status).toBe(400);

    // Username is too short
    const r2 = await api.post('/api/users').send({
      username: '1',
      name: 'Test User',
      password: 'testpassword',
    });
    expect(r2.status).toBe(400);

    // Password is too short
    const r3 = await api.post('/api/users').send({
      username: 'testuser',
      name: 'Test User',
      password: '1',
    });
    expect(r3.status).toBe(400);

    // None of the above should have been added to DB
    const users = await helper.usersInDb();
    expect(users).toHaveLength(1);
  });

  test('a valid user can be added', async () => {
    const user = {
      username: 'validuser',
      name: 'Test User',
      password: 'testpassword',
    };

    const response = await api.post('/api/users').send(user);
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();

    const users = await helper.usersInDb();
    expect(users).toHaveLength(2);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
