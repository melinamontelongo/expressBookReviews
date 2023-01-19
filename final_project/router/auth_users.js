const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  let validusers = users.filter((user) => user.username === username && user.password === password)
  return validusers.length > 0
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const book = books[req.params.isbn];
  if (!book){
    res.status(400).json("Could not find that book.")
  } 
  book.reviews[user] = req.body.review
  res.status(200).json(`${user}'s review on ${book.title} by ${book.author} has been submitted.`);
});
//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const book = books[req.params.isbn];
  if (!book){
    res.status(400).json("Could not find that book.")
  } 
  delete book.reviews[user]
  res.status(200).json(`${user}'s review on ${book.title} by ${book.author} has been successfully deleted.`);
})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
