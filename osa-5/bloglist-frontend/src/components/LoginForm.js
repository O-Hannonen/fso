import { useState, useRef } from 'react';
import Togglable from './Togglable';
import loginService from '../services/login';

const LoginForm = ({ user, setUser, onError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      onError('wrong credentials');
    }
  };

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };
  if (user) {
    return (
      <div>
        <p>{user.name} logged in</p>
        <button type='button' onClick={handleLogOut}>
          log out
        </button>
      </div>
    );
  }

  return (
    <Togglable ref={toggleRef} buttonLabel='log in'>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            id='username'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            id='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit' id='login-button'>
          login
        </button>
      </form>
    </Togglable>
  );
};

export default LoginForm;
