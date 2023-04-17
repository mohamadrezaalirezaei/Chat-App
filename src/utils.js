const sendMessage = (username, message) => {
  return {
    message,
    createdAt: new Date().getTime(),
    username,
  };
};

module.exports = {
  sendMessage,
};
