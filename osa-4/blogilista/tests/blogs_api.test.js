const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./blogs_helper');
const api = supertest(app);

// eslint-disable-next-line no-unused-vars
let user;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const userData = {
    username: 'test',
    name: 'Test User',
    password: 'test',
  };

  await api.post('/api/users').send(userData).expect(201);

  const response = await api.post('/api/login').send(userData).expect(200);
  user = response.body;

  const promises = helper.initialBlogs.map((blog) => {
    return api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${user.token}`)
      .send(blog)
      .expect(201);
  });
  await Promise.all(promises);
});

describe('test /api/blogs', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blogs are identified with id, not _id', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });

  test('a valid blog can be added', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${user.token}`)
      .send(helper.initialBlogs[0]);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });
  test('blog cannot be added without token', async () => {
    const response = await api.post('/api/blogs').send(helper.initialBlogs[0]);
    expect(response.status).toBe(401);
  });

  test('likes defaults to 0', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${user.token}`)
      .send(helper.blogWithoutLikes);
    expect(response.body.likes).toBe(0);
  });

  test('adding invalid blog throws 400', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${user.token}`)
      .send(helper.blogWithoutTitle)
      .expect(400);
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${user.token}`)
      .send(helper.blogWithoutUrl)
      .expect(400);
  });

  test('can delete blog', async () => {
    const blogs = await api.get('/api/blogs');
    await api
      .delete(`/api/blogs/${blogs.body[0].id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .expect(204);
  });
  test('can update blog', async () => {
    const blogs = await api.get('/api/blogs');
    const blog = blogs.body[0];
    blog.title = 'New test title';
    const result = await api
      .put(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send(blog);
    expect(result.body.title).toBe('New test title');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
