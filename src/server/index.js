const path = require("path")
const fs = require("fs")
const { errorHandler } = require("./utils.js")
const { retrieve, transform, transformAgain, retrieveArtists, read, write } = require("./data.js")
let page = 1

retrieve(page)
  .then(shows => transform(shows))
  .then(shows => retrieveArtists(shows))
  .then(shows => transformAgain(shows))
  .then(shows => console.log(shows))
  // .then(shows => read(shows))
  // .then(shows => write(shows))
  .catch(err => errorHandler(err))
