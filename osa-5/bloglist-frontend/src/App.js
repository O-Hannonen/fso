import { useState, useEffect } from 'react';
import { Blogs } from './components/Blogs';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';

const App = () => {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div>
      <LoginForm
        user={user}
        setUser={setUser}
        onError={(message) => showNotification(message, true)}
      />
      <Blogs
        user={user}
        onError={(message) => showNotification(message, true)}
      />

      <Notification message={notification} />
    </div>
  );
};

export default App;
