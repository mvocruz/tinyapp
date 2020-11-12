const urlsForUser = (id,urlsDb) => {

  const userUrls = {};
  for (let shortURL in urlsDb) {
    if (urlsDb[shortURL].userID === id) {
      userUrls[shortURL] = urlsDb[shortURL];
    }
  }
  console.log(userUrls)
  return userUrls;
};



module.exports = { urlsForUser };