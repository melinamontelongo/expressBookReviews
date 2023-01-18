const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  //if the username is taken
  if(users.find((user) => user.username === username) != undefined){
    return res.status(404).json({message: "That username already exists!"});
  }
  if(!username || !password){
    return res.status(404).json({message: "Error registering!"});
  }
  const newUser = {
    username: username,
    password: password
  }
  users.push(newUser);
  res.status(200).json(`The user ${username} has successfully registered!`)
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books)
  })
  getBooks.then((response) => res.status(200).json(response));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const getBook = new Promise((resolve, reject) => {
    resolve(books[req.params.isbn])
  })
  getBook.then((response) => res.send(response))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const getBook = new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books)
    const bookArr = [];
    for (let i = 1; i <= bookKeys.length; i++) {
      let book = books[i]
      if(book.author ===  req.params.author){
        bookArr.push(book)
      }
    }
    resolve(bookArr)
  })
  getBook.then((response) => res.send(response))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const getBook = new Promise ((resolve, reject) => {
    const bookKeys = Object.keys(books)
    const bookArr = [];
    for (let i = 1; i <= bookKeys.length; i++) {
      let book = books[i]
      if(book.title ===  req.params.title){
        bookArr.push(book)
      }
    }
    resolve(bookArr)
  }) 
  getBook.then((response) => res.send(response))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const reqBook = books[req.params.isbn]
  res.send(reqBook.reviews)
});

module.exports.general = public_users;
