const path = require("path")
const fs = require("fs")
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
  const showOutput = path.join(__dirname, "..", "dist", showFile)
  const manifestOutput = path.join(__dirname, "..", "dist", manifestFile)

  writeFile(showOutput, showData)
  writeFile(manifestOutput, manifestData)
}).catch(err => errorHandler(err))