const express = require("express");
const app = express();
const PORT = 8080;
const { urlDatabase } = require("./url_database");
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(cookieParser());

const { generateRandomString } = require("./helperFunctions/generateRandomString");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//------Routing Handlers--------//

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
};
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"] 
  };
  res.render("urls_new", username);
});

app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"] 
  };
  res.render("urls_register", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6); 
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

  app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

  app.post("/logout", (req,res) => {
    res.clearCookie("username");
    res.redirect("/urls");
  });

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL); 
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


app.listen(PORT, () => {
  console.log(`Example app listening on por ${PORT}!`);
});