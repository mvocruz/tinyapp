const express = require("express");
const app = express();
const PORT = 8080;
const { urlDatabase } = require("./url_database");
const { users } = require("./users_database");
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(cookieParser());

const { generateRandomString } = require("./helperFunctions/generateRandomString");
const { getUserByEmail } = require("./helperFunctions/getUserByEmail");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//=======Routing Handlers=========//

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//-------/urls(Main Page) Handlers----------//
app.get('/urls', (req, res) => {
  const id = req.cookies["user_id"];
  const templateVars = {
    urls: urlDatabase,
    user: users[id]
};
res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6); 
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

//------Create New URLs Handlers-----//
app.get("/urls/new", (req, res) => {
  const id = req.cookies["user_id"];
  const templateVars = {
    user: users[id] 
  };
  res.render("urls_new", templateVars);
});

//-----Register Users Handlers -------//
app.get("/register", (req, res) => {
  const id = req.cookies["user_id"];
  const templateVars = {
    user: users[id]
    };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const id = generateRandomString(6); 
  const email = req.body.email;
  const password = req.body.password;
  users[id] = { id, email, password };
  res.cookie("user_id", id);
  res.redirect("/urls");
});

//--------Login/Logout Handlers-------//
app.post("/login", (req, res) => {
  const email = req.body.email;
  const user = getUserByEmail(email, users);
  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//--Utilities (view, delete and update) Handlers--//
app.get("/urls/:shortURL", (req, res) => {
  const id = req.cookies["user_id"];
  const templateVars = {
    user: users[id],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/update", (req,res) => { 
  const longURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = longURL;
  res.redirect("/urls");
});

//--------Short Link to Original URL-------//
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL); 
});

//*******************************************//
app.listen(PORT, () => {
  console.log(`Example app listening on por ${PORT}!`);
});