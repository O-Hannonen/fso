const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  const style = {
    color: message.isError ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  return (
    <div style={style} className={message.isError ? 'error' : 'notification'}>
      {message.message}
    </div>
  );
};

export default Notification;
