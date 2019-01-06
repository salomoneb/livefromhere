const path = require("path")
const fs = require("fs")
const { errorHandler } = require("./utils.js")
const { flattenAndSortShows, getAllShows, getIndividualShow, writeDataToFiles } = require("./data.js")
let page = 1

getAllShows(page)
  .then(shows => flattenAndSortShows(shows))
  .then((sortedShows, errorHandler) => writeDataToFiles(sortedShows))
  .catch(err => errorHandler(err))