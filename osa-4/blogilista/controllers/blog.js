const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
require('express-async-errors');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.status(200).json(blogs);
});

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid',
    });
  }
  const id = request.params.id;
  const blog = await Blog.findById(id);

  if (blog.user.toString() !== request.decodedToken.id) {
    return response.status(401).json({
      error: 'only the user who created the blog can delete it',
    });
  }
  request.user.blogs = request.user.blogs.filter((b) => b.toString() !== id);
  await blog.remove();
  await request.user.save();

  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  if (!request.decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid',
    });
  }
  const id = request.params.id;
  const blogData = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: request.user.id,
  };
  const blog = await Blog.findById(id);
  await blog.updateOne(blogData, { new: true });
  const output = await Blog.findById(id);
  response.status(200).json(output);
});

blogsRouter.post('/', async (request, response) => {
  if (!request.decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid',
    });
  }
  const { title, author, url, likes } = request.body;
  const user = request.user;
  if (!user) {
    return response.status(400).json({ error: 'invalid user id' });
  }

  const blogData = {
    user: user._id,
    title: title,
    author: author,
    url: url,
    likes: likes,
  };
  const blog = new Blog(blogData);

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);

  await user.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
