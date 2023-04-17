const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  username = username.trim().toLowerCase();

  if (!room || !username) {
    return {
      error: "Username and room required",
    };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "username is in use!",
    };
  }
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

const getUsersInRoom = (room) => {
  return users.filter((user) => {
    return user.room == room;
  });
};

//addUser({ id: 3, room: "asd", username: "Ali" });
//addUser({ id: 2, room: "asd", username: "Reza" });

//console.log(getUsersInRoom("asd"));

module.exports = {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
};
