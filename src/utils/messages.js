const generateMessage = (text) => ({
  text,
  createdAt: new Date().getTime(),
});

const generateLocationMessage = (link) => ({
  link,
  createdAt: new Date().getTime(),
});

module.exports = { generateMessage, generateLocationMessage };
