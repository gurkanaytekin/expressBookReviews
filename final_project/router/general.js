const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const password = req.body.password;
  const username = req.body.username;
  let filtered_users = users.filter((user) => user.username === username);
  if (!password || !username) return res.status(400).send('Form data must be valid')
  if (filtered_users.length == 0) {
    users.push({ username: req.body.username, password: req.body.password });
    res.send(`User with the username ${username} added.`);
  } else {
    res.send("Username already in use");
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.json(books);
});

public_users.get('/allBooks', async function (req, res) {
  //Write your code here
  try {
    const booksResponse = await axios.get('http://localhost:5001/')
    return res.json({ books: booksResponse.data })
  } catch (error) {
    res.status(500).json({ message: 'error' })
  }
});

public_users.get('/getISBN/:isbn', async function (req, res) {
  //Write your code here
  try {
    const isbnResponse = await axios.get('http://localhost:5001/isbn/' + req.params.isbn)
    return res.json({ books: isbnResponse.data })
  } catch (error) {
    res.status(500).json({ message: 'error' })
  }
});

public_users.get('/getAuthor/:author', async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get('http://localhost:5001/author/' + req.params.author)
    return res.json({ books: response.data })
  } catch (error) {
    res.status(500).json({ message: 'error' })
  }
});

public_users.get('/getTitle/:title', async function (req, res) {
  //Write your code here
  try {
    const response = await axios.get('http://localhost:5001/title/' + req.params.title)
    return res.json({ books: response.data })
  } catch (error) {
    res.status(500).json({ message: 'error' })
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let book = Object.values(books).filter((item) => item.isbn == req.params.isbn)
  return res.json(book)
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const findedAuthor = Object.values(books).filter((item, index) => item.author == req.params.author)
  return res.json(findedAuthor)
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const findedBook = Object.values(books).filter((item) => item.title == req.params.title)
  return res.json(findedBook)
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const findedBook = Object.values(books).filter((item, index) => item.isbn == req.params.isbn).map(item => item.reviews)
  return res.json(findedBook)
});

module.exports.general = public_users;
