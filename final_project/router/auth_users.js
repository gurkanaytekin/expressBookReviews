const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  const user = users.filter(item => item.username == username && item.password == password)
  if (user.length > 0) return true
  return false
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Body Empty" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(400).json({ message: "User not logged in" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = Object.values(books).filter(item => item.isbn == req.params.isbn)
  if(book.length > 0) {
    book[0].reviews = { review: req.body.review }
    return res.status(200).json({ book: book });
  } else {
    return res.status(300).json({ message: "Book not found" });
  }
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  books = Object.values(books).filter(item => item.isbn != req.params.isbn)
  return res.status(200).json({ books })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
