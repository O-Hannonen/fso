import axios from 'axios';
const baseUrl = '/api/blogs';

const getToken = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    return `bearer ${user.token}`;
  }
  return null;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const update = (updatedBlog) => {
  const config = {
    headers: { Authorization: getToken() },
  };
  const request = axios.put(
    `${baseUrl}/${updatedBlog.id}`,
    updatedBlog,
    config
  );
  return request.then((response) => response.data);
};

const deleteBlog = (id) => {
  const config = {
    headers: { Authorization: getToken() },
  };
  const request = axios.delete(`${baseUrl}/${id}`, config);
  return request.then((response) => response.data);
};

const create = (newBlog) => {
  const config = {
    headers: { Authorization: getToken() },
  };
  const request = axios.post(baseUrl, newBlog, config);
  return request.then((response) => response.data);
};

export default { getAll, create, update, deleteBlog };
