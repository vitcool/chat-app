const generateMessage = (username, text) => ({
  username,
  text,
  createdAt: new Date().getTime(),
});

const generateLocationMessage = (username, link) => ({
  username,
  link,
  createdAt: new Date().getTime(),
});

module.exports = { generateMessage, generateLocationMessage };
