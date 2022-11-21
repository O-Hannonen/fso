// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.sort((a, b) => b.likes - a.likes)[0];
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] ?? 0) + 1;
    return acc;
  }, {});

  const author = Object.keys(authors).sort(
    (a, b) => authors[b] - authors[a]
  )[0];

  console.log(author);

  return {
    author: author,
    blogs: authors[author],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] ?? 0) + blog.likes;
    return acc;
  }, {});

  const author = Object.keys(authors).sort(
    (a, b) => authors[b] - authors[a]
  )[0];

  return {
    author: author,
    likes: authors[author],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
