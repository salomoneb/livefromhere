const path = require("path")
const fs = require("fs")
const { errorHandler } = require("./utils.js")
const { getShows, updateManifest, updateShows} = require("./data.js")
let page = 1

getShows(page)
  .then(shows => updateManifest(shows))
  .then(showsAndManifestIds => updateShows(showsAndManifestIds))
  // .then(results => console.log(results))
  .catch(err => errorHandler(err))
