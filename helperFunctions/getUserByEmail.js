const getUserByEmail = function (email, users) {
  for (let user in users) {
    console.log(user)
    if (users[user].email === email) {
      return users[user];
    }  
  }
};

module.exports = { getUserByEmail };