const path = require("path")
const fs = require("fs")
const { errorHandler } = require("./utils.js")
const { retrieve, transform, read, write } = require("./data.js")
let page = 1

retrieve(page)
  .then(data => transform(data))
  .then(data => read(data))
  .then(data => write(data))
  .catch(err => errorHandler(err))
