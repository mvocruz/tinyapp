function generateRandomString(keyLength) { 
  let key = "";
  let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let charactersLength = characters.length;

  for (i = 0; i < keyLength; i++) {
      let x = Math.floor((Math.random() * charactersLength));
      key += characters[x];
  };

  return key;
};
module.exports = { generateRandomString };