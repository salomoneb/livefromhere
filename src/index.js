const path = require("path")
const fs = require("fs")
const { errorHandler, sort, writeFile } = require("./utils.js")
const { checkManifest, updateManifest, getShows, getIndividualShow } = require("./data.js")
let page = 1
const showPath = path.join(__dirname, "..", "dist")

checkManifest()
  .then(manifestData => getShows(page, JSON.parse(manifestData)))
  .then(shows => {
    const showTest = shows.every(show => show === undefined)
    if (showTest) {
      throw new Error("no new updates")
      return
    }
    writeFile("shows.json", showPath, JSON.stringify(shows))
    return shows
  })
  .then(sortedShows => updateManifest(sortedShows))
  .catch(err => errorHandler(err))