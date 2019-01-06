const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const { fetch, flatten, sort, writeFile, errorHandler } = require("./utils.js")

let promises = []

const showPath = path.join(__dirname, "..", "dist", )
const manifestPath = path.join(__dirname, "..", "dist")

module.exports = {
  flattenAndSortShows(shows) {
    const flattenedShows = flatten(shows)
    return sort(flattenedShows)
  },
  getAllShows(page) {
    let link = `https://www.livefromhere.org/listen/${page}.json/`
    return fetch(link).then((response, errorHandler) => {
      const showSet = module.exports.getIndividualShow(response)
      promises.push(showSet)
      console.log(chalk.blue(`Fetching from ${link}`))
      response = JSON.parse(response)
      if (response.next_page) {
        console.log(chalk.yellow(`Next page: ${response.next_page}`))
        return module.exports.getAllShows(response.next_page)
      }
      return promises
    }).catch(error => errorHandler(error))
  },
  getIndividualShow(data) {
    data = JSON.parse(data)
    return data.items.map(show => {
      return {
        id: show.audio.id,
        date: show.audio.created_at,
        date_ms: Date.parse(show.audio.created_at),
        duration: show.audio.duration_hms,
        title: show.title,
        audio: show.audio.encodings[0].http_file_path,
        artists: show.title.trim().replace("and", "").split(",")
      }
    })
  },
  getManifestData(shows) {
    let data = {
      last_updated_date: new Date(Date.now()),
      last_updated_ms: Date.now(),
      most_recent_show: shows[shows.length-1].title,
      shows: [...shows.map(show => show.id)]
    }
    return data
  },
  writeDataToFiles(shows) {
    const showData = JSON.stringify(shows)
    const manifestData = JSON.stringify(module.exports.getManifestData(shows))
    writeFile("shows.json", showPath, showData)
    writeFile("manifest.json", manifestPath, manifestData)
  }
}
