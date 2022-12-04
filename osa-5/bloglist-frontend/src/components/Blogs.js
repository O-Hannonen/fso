import { useState, useEffect } from 'react';
import blogsService from '../services/blogs';
import NewBlogForm from './NewBlogForm';

const Blogs = ({ user, onError }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogsService.getAll().then((b) => setBlogs(sortBlogs(b)));
  }, []);

  const sortBlogs = (b) => b.sort((a, b) => b.likes - a.likes);

  const onBlogChanged = (oldBlog, newBlog) => {
    if (!newBlog) {
      setBlogs(blogs.filter((blog) => blog.id !== oldBlog.id));
      return;
    }
    setBlogs(sortBlogs(blogs.map((b) => (b.id === oldBlog.id ? newBlog : b))));
  };

  const createBlog = async ({ title, author, url }) => {
    try {
      const newBlog = await blogsService.create({
        title,
        author,
        url,
        likes: 0,
      });
      setBlogs(sortBlogs(blogs.concat(newBlog)));
      return true;
    } catch (exception) {
      onError(`Error creating blog: ${JSON.stringify(exception)}`);
    }
    return false;
  };

  const likeBlog = async (blog) => {
    const newBlog = { ...blog, likes: blog.likes + 1 };
    console.log({ blog, newBlog });
    onBlogChanged(blog, newBlog);

    try {
      await blogsService.update(newBlog);
    } catch (error) {
      const newBlog = { ...blog, likes: blog.likes - 1 };
      onBlogChanged(blog, newBlog);
      onError(`Error liking blog: ${JSON.stringify(error)}`);
    }
  };

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogsService.deleteBlog(blog.id);
        onBlogChanged(blog, null);
      } catch (error) {
        console.log(error);
        onError(`Error deleting blog: ${JSON.stringify(error)}`);
      }
    }
  };

  return (
    <>
      <h2>Blogs</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          deleteBlog={deleteBlog}
        />
      ))}
      <NewBlogForm user={user} createBlog={createBlog} />
    </>
  );
};

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const [expanded, setExpanded] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? 'hide' : 'view'}
        </button>
      </div>
      {expanded && (
        <>
          <div>{blog.url}</div>
          <div id='likes'>
            {blog.likes} <button onClick={() => likeBlog(blog)}>like</button>
          </div>
          <div>{blog.author}</div>
          <button onClick={() => deleteBlog(blog)}>remove</button>
        </>
      )}
    </div>
  );
};

export { Blogs, Blog };
