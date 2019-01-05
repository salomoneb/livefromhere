const path = require("path")
const { flatten, writeFile, errorHandler } = require("./utils.js")
const { getAllShows, getIndividualShow, getManifestData } = require("./scraper.js")

const showFile = "shows.json"
const manifestFile = "manifest.json"
let page = 1

getAllShows(page).then((response, errorHandler) => {
  const flattenedShows = flatten(response)  
  const showData = JSON.stringify(flattenedShows) 
  const latestShow = flattenedShows[0].title 
  const manifestData = JSON.stringify(getManifestData(latestShow))

  const showOutput = path.resolve("../dist", showFile)
  const manifestOutput = path.resolve("../dist", manifestFile)

  writeFile(showOutput, showData)
  writeFile(manifestOutput, manifestData)
}).catch(err => errorHandler(err))