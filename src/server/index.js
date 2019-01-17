const path = require("path")
const fs = require("fs")
const { errorHandler } = require("./utils.js")
const { getAll, filterIds, getIndividual, transform, read, write } = require("./data.js")
let page = 1

getAll(page)
  .then(shows => filterIds(shows))
  .then(shows => getIndividual(shows))
  .then(shows => transform(shows))
  .then(shows => read(shows))
  .then(shows => write(shows))
  .catch(err => errorHandler(err))
