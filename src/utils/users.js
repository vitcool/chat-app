const users = [];

const formatValue = (value) => value.trim().toLowerCase();

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  // format data
  username = formatValue(username);
  room = formatValue(room);

  // validate
  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "Username is already using",
    };
  }

  const user = { id, username, room };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  const user = users.find(({ id: userId }) => userId === id);
  return user;
};

const getUsersInRoom = (roomName) => {
  const roomUsers = users.filter(({ room }) => room === roomName);
  return roomUsers;
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
