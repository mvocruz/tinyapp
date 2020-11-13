const urlsForUser = (id,urlsDb) => {

  const userUrls = {};
  for (let shortURL in urlsDb) {
    if (urlsDb[shortURL].userID === id) {
      userUrls[shortURL] = urlsDb[shortURL];
    }
  }
  return userUrls;
};



module.exports = { urlsForUser };