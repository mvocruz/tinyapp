const express = require("express");
const app = express();
const PORT = 8080;
const { urlDatabase } = require("./url_database");
const { users } = require("./users_database");
const cookieSession = require('cookie-session');
const bcrypt = require("bcrypt");

app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["key1"]
}))

const { generateRandomString } = require("./helperFunctions/generateRandomString");
const { getUserByEmail } = require("./helperFunctions/getUserByEmail");
const { urlsForUser } = require("./helperFunctions/urlsForUser");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


//=======Routing Handlers=========//

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6); 
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});

//------Create New URLs Handlers-----//

app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  const templateVars = {
    user: users[id] 
  };
  if (!id) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});


//-----Register Users Handlers -------//

app.get("/register", (req, res) => {
  const id = req.session.user_id;
  const templateVars = {
    user: users[id]
  };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const checkUser = getUserByEmail(email, users);
  
  if(!email || !password) {
    return res.status(400).send('E-mail or Password is not acceptable.Please try to register again.');
  }
  if (checkUser) {
    return res.status(400).send('E-mail or Password already registered.Please try to register again.');
  }
  const id = generateRandomString(6); 
  users[id] = { id, email, hashedPassword };
  req.session.user_id = id;
  res.redirect(`/urls`);
});

//--------Login/Logout Handlers-------//
app.get("/login", (req, res) => {
  const id = req.session.user_id;
  const templateVars = {
    user: users[id]
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email, users);
  
  if (!user) {
    return res.status(403).send('User not registered');
  }
  if (bcrypt.compareSync(password, user.hashedPassword) === false) {
    return res.status(403).send('User/Password not correct');
  }
  
  req.session.user_id = user.id;
  res.redirect(`/urls`);
});

app.post("/logout", (req,res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get('/urls', (req, res) => {
  const id = req.session.user_id;
  const checkID = urlsForUser(id, urlDatabase);
  const templateVars = {
    urls: checkID,
    user: users[id]
};
  if (!id) {
     
    res.render('urls_index', templateVars);

  } else {
  res.render('urls_userPage', templateVars);
  }
});

//--Utilities (view, delete and update) Handlers--//
app.get("/urls/:shortURL", (req, res) => {
  const id = req.session.user_id;
  const templateVars = {
    user: users[id],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL}

    res.render("urls_show", templateVars);
  });
  
  app.post("/urls/:shortURL/delete", (req,res) => {
    const id = req.session.user_id;
    delete urlDatabase[req.params.shortURL];
    res.redirect(`/urls`);
  });

app.post("/urls/:shortURL/update", (req,res) => {
  const userID = req.session.user_id;
  const longURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = { longURL, userID };
  res.redirect(`/urls/${req.params.shortURL}`);
});

//--------Short Link to Original URL-------//
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL); 
});

//*******************************************//
app.listen(PORT, () => {
  console.log(`Example app listening on por ${PORT}!`);
});