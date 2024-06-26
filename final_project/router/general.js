const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});

});

function getBooksPromise(booksRouter) { 
    return new Promise((resolve, reject) => {
        if (booksRouter) {
            resolve(booksRouter);
        } else {
            reject("No books were found, please try again!");
        }
    });
}

/* Get the book list available in the shop
  public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
 });*/

public_users.get('/', async function (req, res) {
    let bookList = await getBooksPromise(books);
    res.send(bookList);
});

// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });*/

 public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getBooksPromise(books[isbn])
    .then(
        result => res.send(result),
        error => res.send(error)
    )
 });
  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let book = [];
  Object.keys(books).forEach(i => {
    if(books[i].author.toLowerCase() == author.toLowerCase()){
        book.push(books[i])
        }
    });
    res.send(book);
});*/

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    let book = [];
    let bookList = await getBooksPromise(books);

    Object.keys(bookList).forEach(i => {
        if(bookList[i].author.toLowerCase() == author.toLowerCase()){
            book.push(books[i])
        }
    });
    res.send(book);
});

// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let book = [];
  Object.keys(books).forEach(i => {
    if(books[i].title.toLowerCase() == title.toLowerCase()){
        book.push(books[i])
        }
    });
    res.send(book);
});*/

public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    let book = [];
    let bookList = await getBooksPromise(books);

    Object.keys(bookList).forEach(i => {
        if(bookList[i].title.toLowerCase() == title.toLowerCase()){
            book.push(bookList[i])
        }
    });
    res.send(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const details  = req.params.isbn;
    res.send(books[details].reviews)
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
