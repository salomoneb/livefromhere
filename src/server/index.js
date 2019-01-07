const path = require("path")
const fs = require("fs")
const { errorHandler } = require("./utils.js")
const { getShows, readManifest, updateManifest, updateShows} = require("./data.js")
let page = 1

getShows(page)
  .then(shows => updateManifest(shows))
  .then(shows => readManifest(shows))
  .then(showsAndManifestIds => updateShows(showsAndManifestIds))
  .catch(err => errorHandler(err))
