import { useState, useRef } from 'react';
import Togglable from './Togglable';

const NewBlogForm = ({ user, createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const toggleRef = useRef();

  const createNewBlog = async (event) => {
    event.preventDefault();
    const success = await createBlog({ title, author, url });

    if (success) {
      setTitle('');
      setAuthor('');
      setUrl('');
      toggleRef.current.toggleVisibility();
    }
  };

  if (!user) return null;

  return (
    <Togglable ref={toggleRef} buttonLabel='new blog'>
      <h2>Create new blog</h2>
      <form onSubmit={createNewBlog}>
        <div>
          title
          <input
            type='text'
            value={title}
            name='Title'
            placeholder='title'
            id='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type='text'
            value={author}
            name='Author'
            placeholder='author'
            id='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type='text'
            value={url}
            name='url'
            placeholder='url'
            id='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit' id='create-blog'>
          create
        </button>
      </form>
    </Togglable>
  );
};

export default NewBlogForm;
